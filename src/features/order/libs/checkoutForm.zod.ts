import { z } from "zod";

export const checkoutSchema = z.object({
  fullName: z.string().min(3, "Họ tên tối thiểu 3 ký tự"),
  phone: z
    .string()
    .min(9, "Số điện thoại không hợp lệ")
    .max(15, "Số điện thoại không hợp lệ"),
  email: z.string().email("Email không hợp lệ"),
  address: z.string().min(5, "Địa chỉ quá ngắn"),
  city: z.string().min(2, "Thành phố không hợp lệ"),
  zipCode: z.string().min(3, "Mã bưu chính không hợp lệ"),
  paymentMethod: z.enum(["cod", "card", "bank_transfer"]),
});

export type CheckoutFormValues = z.infer<typeof checkoutSchema>;


