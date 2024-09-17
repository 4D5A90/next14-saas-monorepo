"use client";

import { PasswordInput } from "@/components/password-input";
import { SubmitButton } from "@/components/submit-button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { changePasswordFormAction } from "@/lib/auth/actions/change-password";
import { useEffect } from "react";
import { useTwoFactorFormAction } from "@/lib/hooks/use-twofactor-form-action";
import { useFormActionNotification } from "@/lib/hooks/use-form-action-result";

export default function ChangePassword() {
	const {
		execute,
		result: { data, validationErrors },
	} = useTwoFactorFormAction(changePasswordFormAction);

	const handleActionResult = useFormActionNotification({
		successMessage: "Successfully changed password.",
	});

	useEffect(() => {
		if (data || validationErrors) {
			handleActionResult({ data, error: { validationErrors } });
		}
	}, [data, validationErrors, handleActionResult]);

	return (
		<Card className="w-full max-w-md">
			<CardHeader>
				<CardTitle>Password</CardTitle>
				<CardDescription>Change your password</CardDescription>
			</CardHeader>
			<CardContent>
				<form className="space-y-4" action={execute}>
					<div className="space-y-2">
						<Label>Current Password</Label>
						<PasswordInput
							required
							autoComplete="password"
							name="currentPassword"
						/>
					</div>
					<div className="space-y-2">
						<Label>New Password</Label>
						<PasswordInput
							required
							autoComplete="new-password"
							name="newPassword"
						/>
					</div>
					<div className="space-y-2">
						<Label>Confirm New Password</Label>
						<PasswordInput
							required
							autoComplete="new-password"
							name="confirmNewPassword"
						/>
					</div>

					<SubmitButton className="w-full">Change Password</SubmitButton>
				</form>
			</CardContent>
		</Card>
	);
}
