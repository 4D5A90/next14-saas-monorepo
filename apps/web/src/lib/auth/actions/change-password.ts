"use server";

import { twoFactorFormActionClient } from "@/lib/safe-action";
import { changePasswordSchema } from "@/lib/validators/auth";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { Scrypt } from "lucia";
import { zfd } from "zod-form-data";

const schema = zfd.formData(changePasswordSchema);

export const changePasswordFormAction = twoFactorFormActionClient
  .schema(schema)
  .action(async ({ parsedInput, ctx }) => {
    const { newPassword, currentPassword } = parsedInput;
    const { user } = ctx;

    try {
      const existingUser = await db.query.users.findFirst({
        where: (table, { eq }) => eq(table.id, user.id),
        columns: { hashedPassword: true },
      });

      if (!existingUser || !existingUser.hashedPassword) {
        return {
          success: false,
          error: "User not found",
        };
      }

      const isCurrentPasswordValid = await new Scrypt().verify(
        existingUser.hashedPassword,
        currentPassword,
      );

      if (!isCurrentPasswordValid) {
        return {
          success: false,
          error: "Current password is incorrect",
        };
      }

      const hashedPassword = await new Scrypt().hash(newPassword);
      await db.update(users).set({ hashedPassword }).where(eq(users.id, user.id));

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: "Failed to change password",
      };
    }
  });
