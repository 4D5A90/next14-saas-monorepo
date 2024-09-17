import { CheckCircleIcon } from "lucide-react";
import type { ReactNode } from "react";
import { toast } from "sonner";

export const showSuccess = (value: ReactNode) => {
	toast(value, {
		icon: <CheckCircleIcon className="h-4 w-4 text-[#2CC76F]" />,
	});
};
