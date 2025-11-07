import { z } from "zod";

export const zEmailInputs = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});
export type ztEmailInputs = z.infer<typeof zEmailInputs>;

export const zCodeInputs = z.object({
  code: z.string().length(6, { message: "Code must be 6 digits" }),
});
export type ztCodeInputs = z.infer<typeof zCodeInputs>;

export const zNewPasswordInputs = z.object({
  newPassword: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain uppercase" })
    .regex(/[a-z]/, { message: "Must contain lowercase" })
    .regex(/[0-9]/, { message: "Must contain number" })
    .regex(/[#?!@$%^&*-]/, { message: "Must contain special char" }),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords must match",
  path: ["confirmPassword"],
});
export type ztNewPasswordInputs = z.infer<typeof zNewPasswordInputs>;
