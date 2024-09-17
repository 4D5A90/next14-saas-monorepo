import { z } from "zod";

export const signupSchema = z.object({
	email: z.string().email("Please enter a valid email"),
	password: z
		.string()
		.min(8, "Password is too short. Minimum 8 characters required.")
		.max(255),
});
export type SignupInput = z.infer<typeof signupSchema>;

export const loginSchema = z.object({
	email: z.string().email("Please enter a valid email."),
	password: z
		.string()
		.min(8, "Password is too short. Minimum 8 characters required.")
		.max(255),
	otpCode: z
		.string()
		.min(6, { message: "OTP code must be 6 digits" })
		.max(6)
		.optional(),
});

export type LoginInput = z.infer<typeof loginSchema>;

export const forgotPasswordSchema = z.object({
	email: z.string().email(),
});
export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;

export const resetPasswordSchema = z.object({
	token: z.string().min(1, "Invalid token"),
	password: z.string().min(8, "Password is too short").max(255),
});
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;

export const changePasswordSchema = z
	.object({
		currentPassword: z.string().min(1, "Please provide your current password"),
		newPassword: z.string(),
		confirmNewPassword: z.string().min(8, "New password is too short").max(255),
	})
	.refine(
		(values) => {
			return values.newPassword === values.confirmNewPassword;
		},
		{
			message: "Passwords must match",
			//   path: ["confirmNewPassword"],
		},
	);

export type ChangePasswordInput = z.infer<typeof changePasswordSchema>;
