"use client";

import {
  Dispatch,
  PropsWithChildren,
  ReactNode,
  SetStateAction,
  createContext,
  useContext,
  useState,
} from "react";
import { OTPDialog } from "./otp-dialog";

type OTPModalContextType = {
  isOpened: boolean;
  setIsOpened: Dispatch<SetStateAction<boolean>>;

  otp?: string;
  setOTP: Dispatch<SetStateAction<string | undefined>>;

  openModal: () => void;
  closeModal: () => void;
  showError: (error: ReactNode) => void;

  error?: ReactNode;
  setError: Dispatch<SetStateAction<ReactNode>>;
};

export const OTPModalContext = createContext<OTPModalContextType | null>(null);
// give it a display name so it would be easier to debug
OTPModalContext.displayName = "ModalContext";

export const OTPModalContextProvider = ({ children }: PropsWithChildren) => {
  const [isOpened, setIsOpened] = useState(false);
  const [otp, setOTP] = useState<string>();

  const [error, setError] = useState<ReactNode>();

  const openModal = () => {
    setOTP(undefined);
    setIsOpened(true);
  };

  const closeModal = () => {
    setOTP(undefined);
    setIsOpened(false);
  };

  const showError = (error: ReactNode) => {
    setError(error);
    setTimeout(() => {
      setError(undefined);
      setOTP(undefined);
    }, 2500);
  };

  const value = {
    isOpened,
    setIsOpened,
    otp,
    setOTP,
    openModal,
    closeModal,
    error,
    setError,
    showError,
  };

  return (
    <OTPModalContext.Provider value={value}>
      <OTPDialog
        open={isOpened}
        otp={otp}
        onOpenChange={setIsOpened}
        setOTP={setOTP}
        error={error}
      />
      {children}
    </OTPModalContext.Provider>
  );
};

export function useOTPModalContext() {
  const context = useContext(OTPModalContext);
  // if context is undefined this means it was used outside of its provider
  // you can throw an error telling that to your fellow developers
  if (!context) {
    throw new Error("useOTPModalContext must be used under <OTPModalContextProvider/>");
  }

  return context;
}
