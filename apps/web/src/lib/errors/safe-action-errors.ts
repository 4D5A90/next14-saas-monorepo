export type ValidationErrors =
  | { _errors?: string[] }
  | {
      [key: string]: { _errors?: string[] } | undefined;
    }
  | undefined;

// export const getValidationErrors = ({
//   validationErrors,
// }: {
//   validationErrors: ValidationErrors;
// }) => {
//   const allErrors = Object.values(validationErrors).flatMap((errors: ValidationErrors) =>
//     Array.isArray(errors) ? errors : errors?._errors,
//   );

//   return allErrors;
// };
