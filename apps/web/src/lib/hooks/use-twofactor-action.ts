import { useOTPModalContext } from "@/components/otp-modal";
import { useAction, type HookSafeActionFn } from "next-safe-action/hooks";
import { useEffect } from "react";
import type { Schema } from "zod";
import { OTP_LENGTH } from "../constants";
import { showSuccess } from "@/components/toast-success";
import { showError } from "@/components/toast-error";

export function useTwoFactorAction<
	ServerError,
	S extends Schema | undefined,
	BAS extends readonly Schema[],
	CVE,
	CBAVE,
	Data,
>(
	safeActionFn: HookSafeActionFn<ServerError, S, BAS, CVE, CBAVE, Data>,
	opts?: {
		twoFactor?: boolean;
		successMessage?: string;
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
		console.log(status, result);

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

		if (status === "hasSucceeded") {
			if (!result.serverError) {
				showSuccess(opts?.successMessage || "Action executed successfully");
				closeModal();
			}
		}
	}, [status, result, opts]);

	useEffect(() => {
		if (otp?.length === OTP_LENGTH) {
			execute(otp);
		}
	}, [otp, execute]);

	return { execute, status, result, input };
}
