import { z } from "zod";

const createHomeAssetsSchema = z.object({
  section: z.string().trim().min(1, "Section is required"),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().trim().min(1, "Description is required"),
});

export default createHomeAssetsSchema;
