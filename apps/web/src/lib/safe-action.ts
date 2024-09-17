import { createSafeActionClient } from "next-safe-action";
import { validateRequest } from "./auth/validate-request";
import { z } from "zod";
import { redirect } from "next/navigation";
import { Paths } from "./constants";
import { db } from "@/server/db";
import { TOTPController } from "oslo/otp";
import { decodeHex } from "oslo/encoding";
import { zfd } from "zod-form-data";
import { TwoFactorError } from "./errors/two-factor-errors";

const otpSchema = z.string().length(6).nullish();
const otpZfdSchema = zfd.formData({ code: otpSchema });

export const actionClient = createSafeActionClient({
	defaultValidationErrorsShape: "flattened",
	handleReturnedServerError(e) {
		return e.message;
	},
});

export const authActionClient = actionClient.use(async ({ next }) => {
	const { user } = await validateRequest();

	if (!user) {
		return redirect(Paths.Login);
	}

	return next({ ctx: { user } });
});

export const twoFactorActionClient = authActionClient
	.schema(otpSchema)
	.use(async ({ clientInput, ctx, next }) => {
		if (!ctx.user.isTwoFactorEnabled) {
			return next({ ctx });
		}

		const parsedInput = otpSchema.safeParse(clientInput);

		if (!parsedInput.data) throw new TwoFactorError("TWO_FACTOR_REQUIRED");

		const existingUser = await db.query.users.findFirst({
			where: (table, { eq }) => eq(table.id, ctx.user.id),
			columns: { twoFactorSecret: true },
		});

		if (!existingUser || !existingUser.twoFactorSecret)
			throw new Error("USER_NOT_FOUND");

		const validOTP = await new TOTPController().verify(
			parsedInput.data,
			decodeHex(existingUser.twoFactorSecret),
		);

		if (!validOTP) throw new TwoFactorError("INVALID_OTP"); // should create global handler for this

		return next({ ctx });
	});

export const twoFactorFormActionClient = authActionClient.use(
	async ({ clientInput, ctx, next }) => {
		if (!ctx.user.isTwoFactorEnabled) {
			return next({ ctx });
		}

		const input =
			clientInput instanceof FormData
				? Object.fromEntries(clientInput.entries())
				: clientInput;
		const parsedInput = otpZfdSchema.safeParse(input);

		if (!parsedInput.data?.code)
			throw new TwoFactorError("TWO_FACTOR_REQUIRED"); // should create global handler for this

		const existingUser = await db.query.users.findFirst({
			where: (table, { eq }) => eq(table.id, ctx.user.id),
			columns: { twoFactorSecret: true },
		});

		if (!existingUser || !existingUser.twoFactorSecret)
			throw new Error("USER_NOT_FOUND");

		const validOTP = await new TOTPController().verify(
			parsedInput.data.code,
			decodeHex(existingUser.twoFactorSecret),
		);

		if (!validOTP) throw new TwoFactorError("INVALID_OTP"); // should create global handler for this

		return next({ ctx });
	},
);
