import { z } from "zod";

export const courseStatusSchema = z.object({
  status: z.enum(["draft", "under_review", "published", "rejected"], {
    message: "Please select a valid course status",
  }),
});

export type CourseStatusFormData = z.infer<typeof courseStatusSchema>;
