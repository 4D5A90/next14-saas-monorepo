"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { loginFormAction } from "@/lib/auth/actions/login";
import { parseActionErrors } from "@/lib/hooks/use-form-action-result";
import {
	type PropsWithChildren,
	useEffect,
	useState,
	useTransition,
} from "react";
import { TwoFactorField } from "./two-factor-field";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form } from "@/components/ui/form";
import type { z } from "zod";
import { EmailPasswordFields } from "./email-password-fields";
import { Label } from "@/components/ui/label";
import type { ValidationErrors } from "next-safe-action";
import { loginSchema } from "@/lib/validators/auth";
import { LoadingButton } from "@/components/loading-button";

export const LoginForm = ({ children: OAuthButtons }: PropsWithChildren) => {
	const [isFormLoading, startFormTransition] = useTransition();
	const [twoFactorRequired, setTwoFactorRequired] = useState(false);
	const [formErrors, setFormErrors] = useState<{
		error?: string;
		validationErrors?: ValidationErrors<typeof loginFormAction>;
	}>();

	const form = useForm<z.infer<typeof loginSchema>>({
		resolver: zodResolver(loginSchema),
		defaultValues: {
			email: "",
			password: "",
		},
	});

	function onSubmit(values: z.infer<typeof loginSchema>) {
		startFormTransition(async () => {
			const action = await loginFormAction(values);

			if (action?.serverError === "TWO_FACTOR_REQUIRED") {
				setTwoFactorRequired(true);
				setFormErrors({});
			} else if (action?.serverError === "INVALID_OTP") {
				form.setValue("otpCode", "");
				setFormErrors({
					error: "One Time Password is invalid or has expired",
				});
			} else if (action?.data?.error || action?.validationErrors) {
				setFormErrors({
					error: action?.data?.error,
					validationErrors: action?.validationErrors,
				});
			} else {
				setFormErrors({});
			}
		});
	}

	return (
		<div className="flex flex-col">
			{twoFactorRequired ? (
				<Label className="text-2xl font-semibold leading-none tracking-tight self-center pb-4">
					Two Factor Required
				</Label>
			) : (
				OAuthButtons
			)}

			<Form {...form}>
				<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-4">
					{!!formErrors?.validationErrors && (
						<ul className="list-disc space-y-1 rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
							{parseActionErrors({
								error: { validationErrors: formErrors.validationErrors },
							}).map((err) => (
								<li className="ml-4" key={err}>
									{err}
								</li>
							))}
						</ul>
					)}

					{!!formErrors?.error && (
						<p className="rounded-lg border bg-destructive/10 p-2 text-[0.8rem] font-medium text-destructive">
							{formErrors.error}
						</p>
					)}

					{twoFactorRequired ? (
						<TwoFactorField form={form} />
					) : (
						<EmailPasswordFields form={form} />
					)}

					<LoadingButton className="self-stretch" loading={isFormLoading}>
						{twoFactorRequired ? "Verify" : "Log In"}
					</LoadingButton>
					<Button variant="outline" className="w-full" asChild>
						<Link href="/">Cancel</Link>
					</Button>
				</form>
			</Form>
		</div>
	);
};
