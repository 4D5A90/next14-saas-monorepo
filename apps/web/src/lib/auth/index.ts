import { Lucia, TimeSpan } from "lucia";
import { Discord, GitHub, Google } from "arctic";
import { DrizzlePostgreSQLAdapter } from "@lucia-auth/adapter-drizzle";
import { env } from "@/env.js";
import { db } from "@/server/db";
import { sessions, users, type User as DbUser } from "@/server/db/schema";
import { absoluteUrl } from "@/lib/utils";

// Uncomment the following lines if you are using nodejs 18 or lower. Not required in Node.js 20, CloudFlare Workers, Deno, Bun, and Vercel Edge Functions.
// import { webcrypto } from "node:crypto";
// globalThis.crypto = webcrypto as Crypto;

const adapter = new DrizzlePostgreSQLAdapter(db, sessions, users);

export const lucia = new Lucia(adapter, {
	getSessionAttributes: (/* attributes */) => {
		return {};
	},
	getUserAttributes: (attributes) => {
		return {
			id: attributes.id,
			email: attributes.email,
			username: attributes.username,
			emailVerified: attributes.emailVerified,
			avatar: attributes.avatar,
			createdAt: attributes.createdAt,
			updatedAt: attributes.updatedAt,
			// don't expose the secret
			// rather expose whether if the user has setup 2fa
			isTwoFactorEnabled:
				attributes.twoFactorSecret !== null && attributes.twoFactorEnabled,
			githubId: attributes.githubId,
		};
	},
	sessionExpiresIn: new TimeSpan(30, "d"),
	sessionCookie: {
		name: "session",

		expires: false, // session cookies have very long lifespan (2 years)
		attributes: {
			secure: env.NODE_ENV === "production",
		},
	},
});

export const discord = new Discord(
	env.DISCORD_CLIENT_ID,
	env.DISCORD_CLIENT_SECRET,
	absoluteUrl("/login/discord/callback"),
);

export const github = new GitHub(
	env.GITHUB_CLIENT_ID,
	env.GITHUB_CLIENT_SECRET,
);

export const google = new Google(
	env.GOOGLE_CLIENT_ID,
	env.GOOGLE_CLIENT_SECRET,
	env.GOOGLE_REDIRECT_URI,
);

declare module "lucia" {
	interface Register {
		Lucia: typeof lucia;
		DatabaseSessionAttributes: DatabaseSessionAttributes;
		DatabaseUserAttributes: DatabaseUserAttributes;
	}
}

// biome-ignore lint/suspicious/noEmptyInterface: needed for Lucia types
interface DatabaseSessionAttributes {}
interface DatabaseUserAttributes extends Omit<DbUser, "hashedPassword"> {
	twoFactorSecret: string | null;
	twoFactorEnabled: boolean;
}
