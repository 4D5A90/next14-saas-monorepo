import { redirect } from "next/navigation";
import { env } from "@/env";
import type { Metadata } from "next";
import * as React from "react";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Posts",
	description: "Manage your posts here",
};

interface Props {
	searchParams: Record<string, string | string[] | undefined>;
}

export default async function DashboardPage({ searchParams }: Props) {
	const { user } = await validateRequest();

	if (!user) redirect(Paths.Login);

	/**
	 * Passing multiple promises to `Promise.all` to fetch data in parallel to prevent waterfall requests.
	 * Passing promises to the `Posts` component to make them hot promises (they can run without being awaited) to prevent waterfall requests.
	 * @see https://www.youtube.com/shorts/A7GGjutZxrs
	 * @see https://nextjs.org/docs/app/building-your-application/data-fetching/patterns#parallel-data-fetching
	 */

	return (
		<div>
			<div className="mb-6">
				<h1 className="text-3xl font-bold md:text-4xl">Dashboard</h1>
				<p className="text-sm text-muted-foreground">
					Check your insights here
				</p>
			</div>
		</div>
	);
}
