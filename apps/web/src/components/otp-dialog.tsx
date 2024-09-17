import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { OtpStyledInput } from "./otp-input";
import { ReactNode, useEffect } from "react";
import { cn } from "@/lib/utils";

interface OTPDialogProps {
  open: boolean;
  onOpenChange: React.Dispatch<React.SetStateAction<boolean>>;
  otp?: string;
  setOTP: React.Dispatch<React.SetStateAction<string | undefined>>;

  error?: ReactNode;
}

export function OTPDialog({ open, onOpenChange, otp, setOTP, error }: OTPDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Two-Factor Authentification</DialogTitle>
          <DialogDescription>
            <OtpStyledInput
              numInputs={6}
              inputType="number"
              value={otp}
              onChange={setOTP}
              className={cn("my-4", error && "text-destructive dark:text-red-500")}
            />
            {error && (
              <div className="flex items-center justify-center font-bold text-destructive dark:text-red-500">
                {error}
              </div>
            )}
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
