import * as React from "react";

import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PasswordInput } from "./password-input";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const FloatingInput = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, ...props }, ref) => {
    return <Input placeholder=" " className={cn("peer", className)} ref={ref} {...props} />;
  },
);
FloatingInput.displayName = "FloatingInput";

const FloatingLabel = React.forwardRef<
  React.ElementRef<typeof Label>,
  React.ComponentPropsWithoutRef<typeof Label>
>(({ className, ...props }, ref) => {
  return (
    <Label
      className={cn(
        [
          "absolute start-2 top-2 z-10 origin-[0] -translate-y-4 scale-75 transform bg-transparent px-2 text-sm text-gray-500 duration-300 dark:bg-background",
          "peer-focus:secondary peer-focus:dark:secondary peer-focus:top-2 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:bg-white peer-focus:px-2 peer-focus:dark:bg-background rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4",
          "peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:scale-100",
        ],
        className,
      )}
      ref={ref}
      {...props}
    />
  );
});
FloatingLabel.displayName = "FloatingLabel";

type FloatingLabelInputProps = InputProps & { label?: string };

const FloatingLabelInput = React.forwardRef<
  React.ElementRef<typeof FloatingInput>,
  React.PropsWithoutRef<FloatingLabelInputProps>
>(({ id, label, ...props }, ref) => {
  return (
    <div className="relative">
      <FloatingInput ref={ref} id={id} {...props} />
      <FloatingLabel htmlFor={id}>{label}</FloatingLabel>
    </div>
  );
});
FloatingLabelInput.displayName = "FloatingLabelInput";

export { FloatingInput, FloatingLabel, FloatingLabelInput };