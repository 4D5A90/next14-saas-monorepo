"use client";

import { LoadingButton } from "@/components/loading-button";
import { showError } from "@/components/toast-error";
import { showSuccess } from "@/components/toast-success";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
	generateTwoFactorSecret,
	getQRCode,
	verifyTwoFactor,
	//   disableTwoFactor,
} from "@/lib/auth/actions";
import { disableTwoFactor as disableTwoFactorAction } from "@/lib/auth/actions/two-factor";
import { useTwoFactorAction } from "@/lib/hooks/use-twofactor-action";
import type { User } from "lucia";
import { LoaderIcon, LockKeyholeIcon } from "lucide-react";
import { useState, useTransition } from "react";
import QRCode from "react-qr-code";

export default function TwoFactor(user: User) {
	const [qrCodeURI, setQRCodeURI] = useState<string | null>(null);
	const [isLoadingQRCode, startQRCodeTransition] = useTransition();
	const [isLoadingVerify, startVerifyTransition] = useTransition();
	const [verificationCode, setVerificationCode] = useState<string>("");
	const { execute: disableTwoFactor } = useTwoFactorAction(
		disableTwoFactorAction,
		{
			successMessage: "2FA disabled successfully",
		},
	);

	const enable2FA = () =>
		startQRCodeTransition(async () => {
			const { success, error } = await generateTwoFactorSecret();
			if (success) {
				const { uri } = await getQRCode();
				if (uri) setQRCodeURI(uri);
			}

			if (error) showError(error);
		});

	const verify2FA = () =>
		startVerifyTransition(async () => {
			const { success, error } = await verifyTwoFactor(verificationCode);

			if (success) {
				showSuccess("2FA enabled successfully");
				setQRCodeURI(null);
				setVerificationCode("");
			}

			if (error) showError(error);
		});

	return (
		<div className="flex w-full flex-col gap-10">
			{user.isTwoFactorEnabled ? (
				<div className="m-auto flex flex-col items-center justify-center gap-4">
					<div className="flex flex-row items-center gap-2 text-[#2CC76F]">
						<LockKeyholeIcon size={18} />
						<span className="text-sm font-semibold">
							Two Factor Authentication is enabled
						</span>
					</div>
					<Button
						className="w-full"
						onClick={() => disableTwoFactor(undefined)}
					>
						Disable 2FA
					</Button>
				</div>
			) : (
				<div className="flex flex-col gap-4">
					<Button
						className="w-full"
						disabled={!!qrCodeURI}
						variant={qrCodeURI ? "outline" : "default"}
						onClick={enable2FA}
					>
						Enable 2FA
					</Button>
					<div className="flex max-w-min justify-center self-center rounded-md border p-4">
						{qrCodeURI ? (
							<QRCode value={qrCodeURI} />
						) : (
							<div className="flex h-[200px] w-56 items-center justify-center text-sm font-normal text-gray-400">
								{isLoadingQRCode ? (
									<LoaderIcon className="animate-spin" />
								) : (
									"QR Code"
								)}
							</div>
						)}
					</div>
					{!!qrCodeURI && (
						<div className="flex flex-row gap-1">
							<Input
								className="w-full"
								placeholder="Enter the code"
								onChange={(event) =>
									setVerificationCode(event.currentTarget.value)
								}
							/>
							<LoadingButton
								className="w-full flex-1"
								onClick={verify2FA}
								loading={isLoadingVerify}
							>
								Verify
							</LoadingButton>
						</div>
					)}
				</div>
			)}
		</div>
	);
}
