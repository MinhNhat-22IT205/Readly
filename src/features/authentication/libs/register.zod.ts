import { z } from "zod";

export const zRegisterInputs = z.object({
  name: z.string().min(2, { message: "Name required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .regex(/[A-Z]/, { message: "Must contain uppercase" })
    .regex(/[a-z]/, { message: "Must contain lowercase" })
    .regex(/[0-9]/, { message: "Must contain a number" })
    .regex(/[#?!@$%^&*-]/, { message: "Must contain special char" }),
});
export type ztRegisterInputs = z.infer<typeof zRegisterInputs>;
