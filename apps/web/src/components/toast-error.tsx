import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import type { ReactNode } from "react";
import { toast } from "sonner";

export const showError = (error: ReactNode) => {
	toast(error, {
		icon: <ExclamationTriangleIcon className="h-4 w-4 text-destructive" />,
	});
};

export const showErrors = (errors: ReactNode[]) => {
	for (const error of errors) showError(error);
};
