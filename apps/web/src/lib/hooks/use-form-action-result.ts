import { showError } from "@/components/toast-error";
import { showSuccess } from "@/components/toast-success";
import type {
	FlattenedValidationErrors,
	ValidationErrors,
} from "next-safe-action";

interface FormActionResult<VE extends ValidationErrors<any>> {
	data?: {
		success?: boolean;
		error?: string;
	};

	error: {
		serverError?: string | undefined;
		validationErrors?:
			| FlattenedValidationErrors<VE>
			| {
					formErrors: string[];
					fieldErrors: {
						[x: string]: string[] | undefined;
						[x: number]: string[] | undefined;
						[x: symbol]: string[] | undefined;
					};
			  }
			| undefined;
		bindArgsValidationErrors?: readonly [] | undefined;
		fetchError?: string;
	};
}

export const useFormActionNotification = <VE extends ValidationErrors<any>>({
	successMessage,
}: {
	successMessage: string;
}) => {
	const handleActionResult = ({ data, error }: FormActionResult<VE>) => {
		if (data?.success) {
			showSuccess(successMessage);
		}

		if (data?.error || error) {
			console.log("dede", data, error);
			const allErrors = parseActionErrors({ data, error });

			if (allErrors.length > 0)
				for (const error of allErrors) showError(error as string);
		}
	};

	return handleActionResult;
};

export const parseActionErrors = <VE extends ValidationErrors<any>>(
	{ data, error }: FormActionResult<VE>,
	defaultError?: string,
) => {
	const allErrors = [];

	if (data?.error) {
		allErrors.push(data.error);
	}

	if (error.validationErrors) {
		allErrors.push([
			...error.validationErrors.formErrors,
			...Object.values(error.validationErrors.fieldErrors),
		]);
	}

	if (error.serverError) allErrors.push(error.serverError);

	// if (error.fetchError) allErrors.push(error.fetchError);

	// if (allErrors.length === 0)
	// 	allErrors.push(defaultError || "Something went wrong");

	return allErrors.flat() as string[];
};
