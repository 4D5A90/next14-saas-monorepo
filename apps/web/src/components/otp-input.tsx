import React from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import OtpInput, { OTPInputProps } from "react-otp-input";

type OtpOptions = Omit<OTPInputProps, "renderInput">;

type OtpStyledInputProps = {
  className?: string;
} & OtpOptions;

export const OtpStyledInput = ({ className, ...props }: OtpStyledInputProps) => {
  return (
    <OtpInput
      {...props}
      renderInput={(inputProps) => (
        <Input
          {...inputProps}
          className={cn(
            "!w-12 selection:bg-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none",
            className,
          )}
          name="otp"
        />
      )}
      containerStyle={`flex justify-center items-center flex-wrap text-2xl font-bold ${
        props.renderSeparator ? "gap-1" : "gap-x-3 gap-y-2"
      }`}
    />
  );
};
