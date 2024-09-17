import { useOTPModalContext } from "@/components/otp-modal";
import { useAction, type HookSafeActionFn } from "next-safe-action/hooks";
import { useEffect } from "react";
import type { Schema } from "zod";
import { OTP_LENGTH } from "../constants";

export function useTwoFactorFormAction<
	ServerError,
	S extends Schema | undefined,
	BAS extends readonly Schema[],
	CVE,
	CBAVE,
	Data,
>(
	safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
	opts?: {
		twoFactor: boolean;
	},
) {
	const {
		otp,
		showError: showModalError,
		openModal,
		closeModal,
	} = useOTPModalContext();
	const { execute, status, result, input } = useAction(safeActionFn);

	useEffect(() => {
		if (status === "hasErrored") {
			if (result.serverError === "TWO_FACTOR_REQUIRED") {
				openModal();
			} else if (result.serverError === "INVALID_OTP") {
				showModalError("Invalid OTP");
			} else {
				// @ts-expect-error TODO: fix this
				if (result.data?.error) showError(result.data?.error);
				closeModal();
			}
		}
	}, [status, result]);

	useEffect(() => {
		if (otp?.length === OTP_LENGTH) {
			const formData = new FormData();

			for (const [key, value] of (input as FormData).entries()) {
				formData.append(key, value);
			}

			formData.set("code", otp);
			execute(formData as any);
		}
	}, [otp, input, execute]);

	return { execute, status, result, input };
}
