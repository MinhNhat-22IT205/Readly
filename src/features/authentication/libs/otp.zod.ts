import { z } from "zod";

export const zRequestOTPInputs = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
export type ztRequestOTPInputs = z.infer<typeof zRequestOTPInputs>;

export const zVerifyOTPInputs = z.object({
  email: z.string().email({ message: "Invalid email address" }),
  otp: z.string().length(6, { message: "OTP must be 6 digits" }),
});
export type ztVerifyOTPInputs = z.infer<typeof zVerifyOTPInputs>;

