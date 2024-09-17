"use server";

import { twoFactorActionClient } from "@/lib/safe-action";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { revalidatePath } from "next/cache";

export const disableTwoFactor = twoFactorActionClient.action(async () => {
	try {
		await db.update(users).set({
			twoFactorSecret: null,
			twoFactorEnabled: false,
		});

		// revalidatePath("/dashboard/settings");

		return {
			success: true,
		};
	} catch (error) {
		return {
			success: false,
			error: "Failed to disable 2FA",
		};
	}
});
