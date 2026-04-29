import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";

import { requireAuth } from "../middleware/require-auth.js";
import { listSkillOptionsQuerySchema } from "../schemas/skill-options.requests.js";
import { listSkillOptions } from "../services/skill-options/list-skill-options.js";
import { zodErrorResponse } from "../shared/validation/zod-error-response.js";
import type { AppVariables } from "../types/hono.js";

export const skillOptionsRoutes = new Hono<{ Variables: AppVariables }>();

skillOptionsRoutes.use("*", requireAuth);

skillOptionsRoutes.get(
  "/",
  zValidator("query", listSkillOptionsQuerySchema, (result, c) => {
    if (!result.success) {
      return zodErrorResponse(c, result.error);
    }
  }),
  async (c) => {
    const query = c.req.valid("query");

    const skillOptions = await listSkillOptions(query);

    return c.json({
      status: "ok",
      skillOptions,
    });
  },
);
