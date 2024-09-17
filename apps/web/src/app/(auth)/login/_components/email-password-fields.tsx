import { FloatingLabelInput } from "@/components/floating-label-input";
import { FloatingLabelPasswordInput } from "@/components/password-input";
import { Button } from "@/components/ui/button";
import {
	FormControl,
	FormField,
	FormItem,
	FormMessage,
} from "@/components/ui/form";
import Link from "next/link";
import { Fragment } from "react";
import type { z } from "zod";
import type { UseFormReturn } from "react-hook-form";
import type { loginSchema } from "@/lib/validators/auth";

export const EmailPasswordFields = ({
	form,
}: { form: UseFormReturn<z.infer<typeof loginSchema>> }) => {
	return (
		<Fragment>
			<FormField
				control={form.control}
				name="email"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<FloatingLabelInput
								required
								id="email"
								type="email"
								autoComplete="email"
								label="Email"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<FormField
				control={form.control}
				name="password"
				render={({ field }) => (
					<FormItem>
						<FormControl>
							<FloatingLabelPasswordInput
								required
								id="password"
								autoComplete="password"
								{...field}
							/>
						</FormControl>
						<FormMessage />
					</FormItem>
				)}
			/>

			<div className="flex flex-wrap justify-between">
				<Button variant={"link"} size={"sm"} className="p-0" asChild>
					<Link href={"/signup"}>Not signed up? Sign up now.</Link>
				</Button>
				<Button variant={"link"} size={"sm"} className="p-0" asChild>
					<Link href={"/reset-password"}>Forgot password?</Link>
				</Button>
			</div>
		</Fragment>
	);
};
