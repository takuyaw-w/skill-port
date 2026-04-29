import { z } from "zod";

const booleanQuerySchema = z.enum(["true", "false"]).transform((value) => value === "true");

export const listSkillOptionsQuerySchema = z
  .object({
    category: z.string().trim().min(1).max(100).optional(),
    q: z.string().trim().min(1).max(100).optional(),
    activeOnly: booleanQuerySchema.optional().default(true),
  })
  .strict();

export type ListSkillOptionsQuery = z.infer<typeof listSkillOptionsQuerySchema>;
