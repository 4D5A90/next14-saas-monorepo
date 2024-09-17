import { redirect } from "next/navigation";
import { validateRequest } from "@/lib/auth/validate-request";
import { Paths } from "@/lib/constants";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { APP_TITLE } from "@/lib/constants";
import { OAuthButtons } from "./_components/oauth-buttons";
import { LoginForm } from "./_components/login-form";

export const metadata = {
	title: "Login",
	description: "Login Page",
};

export default async function LoginPage() {
	const { user } = await validateRequest();

	if (user) redirect(Paths.Dashboard);

	return (
		<Card className="w-full max-w-md">
			<CardHeader className="text-center">
				<CardTitle>{APP_TITLE} Log In</CardTitle>
				<CardDescription>
					Log in to your account to access your dashboard
				</CardDescription>
			</CardHeader>
			<CardContent>
				<LoginForm>
					<OAuthButtons />
				</LoginForm>
			</CardContent>
		</Card>
	);
}
