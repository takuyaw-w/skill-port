import { z } from "zod";

import { projectPhaseValues, projectRoleValues, skillCategoryValues } from "@skill-port/shared";

const optionalTextSchema = z.string().trim().max(1000).optional();
const optionalShortTextSchema = z.string().trim().max(255).optional();

const skillCategorySchema = z.enum(skillCategoryValues);
const projectRoleSchema = z.enum(projectRoleValues);
const projectPhaseSchemaValue = z.enum(projectPhaseValues);

const skillItemSchema = z
  .object({
    skillOptionId: z.uuid().optional().nullable(),
    category: skillCategorySchema,
    name: z.string().trim().min(1).max(255),
    normalizedName: z.string().trim().min(1).max(255).optional().nullable(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .strict();

const projectTechnologySchema = z
  .object({
    skillOptionId: z.uuid().optional().nullable(),
    category: skillCategorySchema,
    name: z.string().trim().min(1).max(255),
    normalizedName: z.string().trim().min(1).max(255).optional().nullable(),
    sortOrder: z.number().int().min(0).optional(),
  })
  .strict();

const projectPhaseSchema = z
  .object({
    phase: projectPhaseSchemaValue,
    sortOrder: z.number().int().min(0).optional(),
  })
  .strict();

const projectSchema = z
  .object({
    startYearMonth: z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/),
    endYearMonth: z
      .string()
      .regex(/^\d{4}-(0[1-9]|1[0-2])$/)
      .optional()
      .nullable(),

    name: z.string().trim().min(1).max(255),
    summary: optionalTextSchema,
    responsibilities: optionalTextSchema,

    role: projectRoleSchema.optional().nullable(),
    teamSize: z.number().int().min(1).optional().nullable(),

    sortOrder: z.number().int().min(0).optional(),

    technologies: z.array(projectTechnologySchema).default([]),
    phases: z.array(projectPhaseSchema).default([]),
  })
  .strict()
  .superRefine((value, ctx) => {
    if (!value.endYearMonth) {
      return;
    }

    if (value.startYearMonth > value.endYearMonth) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ["endYearMonth"],
        message: "終了年月は開始年月以降を指定してください。",
      });
    }
  });

export const saveSkillSheetRequestSchema = z
  .object({
    publicInitials: z.string().trim().min(1).max(20),
    nearestStation: optionalShortTextSchema,
    experienceLabel: optionalShortTextSchema,
    selfPr: optionalTextSchema,

    certifications: z
      .array(
        z
          .object({
            name: z.string().trim().min(1).max(255),
            sortOrder: z.number().int().min(0).optional(),
          })
          .strict(),
      )
      .default([]),

    skills: z.array(skillItemSchema).default([]),

    projects: z.array(projectSchema).default([]),
  })
  .strict();

export type SaveSkillSheetRequest = z.infer<typeof saveSkillSheetRequestSchema>;
