import { z } from "zod";

export const zRegisterInputs = z.object({
  name: z.string().min(2, { message: "Name required" }),
  email: z.string().email({ message: "Invalid email address" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
export type ztRegisterInputs = z.infer<typeof zRegisterInputs>;
