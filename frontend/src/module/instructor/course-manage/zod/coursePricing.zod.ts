import { z } from "zod";

export const coursePricingSchema = z
  .object({
    priceType: z.enum(["free", "paid"]),
    price: z
      .number()
      .min(0, "Price cannot be negative"),
  })
  .refine(
    (data) => {
      if (data.priceType === "paid" && data.price <= 0) {
        return false;
      }
      return true;
    },
    {
      message: "Paid courses must have a price greater than 0.",
      path: ["price"],
    }
  );

export type CoursePricingFormData = z.infer<typeof coursePricingSchema>;
