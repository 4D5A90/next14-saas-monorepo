import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { env } from "@/env";
import { validateRequest } from "@/lib/auth/validate-request";
import ChangePassword from "./_components/change-password";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import TwoFactor from "./_components/two-factor";

export const metadata: Metadata = {
	metadataBase: new URL(env.NEXT_PUBLIC_APP_URL),
	title: "Settings",
	description: "Manage your account settings",
};

export default async function SettingsPage() {
	const { user } = await validateRequest();

	if (!user) {
		redirect("/login");
	}

	return (
		<div className="flex w-full flex-col gap-8">
			<div>
				<h1 className="text-3xl font-bold md:text-4xl">Account Settings</h1>
				<p className="text-sm text-muted-foreground">
					Manage your account settings
				</p>
			</div>
			<div className="grid grid-rows-2 gap-6 md:grid-cols-2">
				<ChangePassword />
				<div className="col-span-1">
					<Card className="w-full max-w-md">
						<CardHeader>
							<CardTitle>Two Factor</CardTitle>
							<CardDescription>
								Enable two factor authentication
							</CardDescription>
						</CardHeader>
						<CardContent>
							<div className="m-0 flex items-center justify-center">
								<TwoFactor {...user} />
							</div>
						</CardContent>
					</Card>
				</div>
			</div>
		</div>
	);
}
