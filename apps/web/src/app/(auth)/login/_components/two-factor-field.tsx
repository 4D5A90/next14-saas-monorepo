import type { UseFormReturn } from "react-hook-form";
import type { z } from "zod";
import {
	InputOTP,
	InputOTPGroup,
	InputOTPSlot,
} from "@/components/ui/input-otp";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import type { loginSchema } from "@/lib/validators/auth";

type TwoFactorFieldProps = {
	form: UseFormReturn<z.infer<typeof loginSchema>>;
};

export const TwoFactorField = ({ form }: TwoFactorFieldProps) => {
	return (
		<FormField
			control={form.control}
			name="otpCode"
			render={({ field }) => (
				<FormItem className="flex flex-col items-center space-y-0">
					<FormControl>
						<InputOTP maxLength={6} {...field}>
							<InputOTPGroup>
								<InputOTPSlot index={0} />
								<InputOTPSlot index={1} />
								<InputOTPSlot index={2} />
								<InputOTPSlot index={3} />
								<InputOTPSlot index={4} />
								<InputOTPSlot index={5} />
							</InputOTPGroup>
						</InputOTP>
					</FormControl>
					<FormMessage />
				</FormItem>
			)}
		/>
	);
};
