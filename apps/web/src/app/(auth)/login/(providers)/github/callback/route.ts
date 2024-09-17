import { github, lucia } from "@/lib/auth";
import { cookies } from "next/headers";
import { OAuth2RequestError } from "arctic";
import { generateIdFromEntropySize } from "lucia";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";

export async function GET(request: Request): Promise<Response> {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const storedState = cookies().get("github_oauth_state")?.value ?? null;
  if (!code || !state || !storedState || state !== storedState) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const tokens = await github.validateAuthorizationCode(code);
    const headers = { Authorization: `Bearer ${tokens.accessToken}` };
    const githubUserResponse = await fetch("https://api.github.com/user", {
      headers,
    });
    const githubUser: GitHubUser = await githubUserResponse.json();

    const githubEmailResponse = await fetch("https://api.github.com/user/emails", {
      headers,
    });

    const githubEmails: GithubEmail[] = await githubEmailResponse.json();
    const githubEmail = githubEmails.find((email) => email.primary);

    if (!githubEmail) throw new Error("Github email isn't available");

    // Replace this with your own DB client.
    const existingUser = await db.query.users.findFirst({
      where: (table, { eq, or }) =>
        or(eq(table.githubId, githubUser.id), eq(table.email, githubEmail.email)),
    });

    if (existingUser) {
      // maybe we should warn the user that email is already linked with another OAUTH2 account?
      await db
        .update(users)
        .set({
          githubId: githubUser.id,
          emailVerified: true,
          username: githubUser.login,
        })
        .where(eq(users.id, existingUser.id));

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
    await db.insert(users).values({
      id: userId,
      email: githubEmail.email,
      username: githubUser.login,
      githubId: githubUser.id,
      emailVerified: true,
    });

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
    // the specific error message depends on the provider
    if (e instanceof OAuth2RequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }

    redirect("/login?error");
    // return new Response(null, {
    //   status: 500,
    // });
  }
}

interface GitHubUser {
  id: string;
  login: string;
  email: string;
}

interface GithubEmail {
  email: string;
  verified: boolean;
  primary: boolean;
  visibility: string | null;
}
