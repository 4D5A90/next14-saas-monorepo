export const TWO_FACTOR_ERRORS = ["TWO_FACTOR_REQUIRED", "INVALID_OTP"] as const;
export type TWO_FACTOR_ERROR = (typeof TWO_FACTOR_ERRORS)[number];

export class TwoFactorError extends Error {
  constructor(message: TWO_FACTOR_ERROR) {
    super(message);
    this.name = "TwoFactorError";
  }
}
