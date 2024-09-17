"use server";

import { actionClient, authActionClient } from "@/lib/safe-action";
import { loginSchema } from "@/lib/validators/auth";
import { db } from "@/server/db";
import { Scrypt } from "lucia";
import { zfd } from "zod-form-data";
import { lucia } from "..";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { Paths } from "@/lib/constants";
import { TOTPController } from "oslo/otp";
import { decodeHex } from "oslo/encoding";
import { TwoFactorError } from "@/lib/errors/two-factor-errors";

const schema = zfd.formData(loginSchema);

export const loginFormAction = actionClient
	.schema(schema)
	.action(async ({ parsedInput }) => {
		const { email, password, otpCode } = parsedInput;

		const existingUser = await db.query.users.findFirst({
			where: (table, { eq }) => eq(table.email, email),
		});

		if (!existingUser || !existingUser?.hashedPassword) {
			return {
				success: false,
				error: "Incorrect email or password",
			};
		}

		const validPassword = await new Scrypt().verify(
			existingUser.hashedPassword,
			password,
		);
		if (!validPassword) {
			return {
				success: false,
				error: "Incorrect email or password",
			};
		}

		if (existingUser?.twoFactorEnabled && existingUser.twoFactorSecret) {
			if (!otpCode) {
				throw new TwoFactorError("TWO_FACTOR_REQUIRED");
			}

			const validOTP = await new TOTPController().verify(
				otpCode,
				decodeHex(existingUser.twoFactorSecret),
			);

			if (!validOTP) throw new TwoFactorError("INVALID_OTP");
		}

		const session = await lucia.createSession(existingUser.id, {});
		const sessionCookie = lucia.createSessionCookie(session.id);
		cookies().set(
			sessionCookie.name,
			sessionCookie.value,
			sessionCookie.attributes,
		);
		return redirect(Paths.Dashboard);
	});
