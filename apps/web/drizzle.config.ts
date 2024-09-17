import { defineConfig } from "drizzle-kit";
import { DATABASE_PREFIX } from "@/lib/constants";
import { env } from "@/env";

console.log(env.DATABASE_URL);
export default defineConfig({
	schema: "./src/server/db/schema.ts",
	out: "./drizzle",
	dialect: "postgresql",
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	tablesFilter: [`${DATABASE_PREFIX}_*`],
});
