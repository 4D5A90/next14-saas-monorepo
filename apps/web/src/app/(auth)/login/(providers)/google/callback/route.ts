import { google, lucia } from "@/lib/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { OAuth2RequestError } from "arctic";
import { eq } from "drizzle-orm";
import { generateIdFromEntropySize } from "lucia";
import { cookies } from "next/headers";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  const storedState = cookies().get("google_oauth_state")?.value;
  const storedCodeVerifier = cookies().get("google_code_verifier")?.value;

  if (!code || !storedState || !storedCodeVerifier || state !== storedState) {
    // 400
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await google.validateAuthorizationCode(code, storedCodeVerifier);

    const response = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: {
        Authorization: `Bearer ${tokens.accessToken}`,
      },
    });
    const googleUser = await response.json();

    const existingUser = await db.query.users.findFirst({
      where: (table, { eq, or }) =>
        or(eq(table.githubId, googleUser.id), eq(table.email, googleUser.email)),
    });

    if (existingUser) {
      // maybe we should warn the user that email is already linked with another OAUTH2 account?
      //   await db
      //     .update(users)
      //     .set({
      //       githubId: githubUser.id,
      //       emailVerified: true,
      //       username: githubUser.login,
      //     })
      //     .where(eq(users.id, existingUser.id));

      const session = await lucia.createSession(existingUser.id, {});
      const sessionCookie = lucia.createSessionCookie(session.id);
      cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
      return new Response(null, {
        status: 302,
        headers: {
          Location: "/",
        },
      });
    }

    const userId = generateIdFromEntropySize(13); // 21 characters long

    // Replace this with your own DB client.
    // await db.insert(users).values({
    //   id: userId,
    //   email: githubEmail.email,
    //   username: githubUser.login,
    //   githubId: githubUser.id,
    //   emailVerified: true,
    // });

    const session = await lucia.createSession(userId, {});
    const sessionCookie = lucia.createSessionCookie(session.id);
    cookies().set(sessionCookie.name, sessionCookie.value, sessionCookie.attributes);
    return new Response(null, {
      status: 302,
      headers: {
        Location: "/",
      },
    });
  } catch (e) {
    if (e instanceof OAuth2RequestError) {
      const { request, message, description } = e;
      return new Response(message, {
        status: 400,
      });
    }

    return Response.redirect("/login?error");
    // unknown error
  }
}
