import { Hono } from "hono";
import { requireAdmin } from "../middleware/require-admin.js";

export const adminRoutes = new Hono()

adminRoutes.use("*", requireAdmin)

adminRoutes.get("/me", async (c) => {
  return c.json({
    status: 'ok',
    scope: "admin"
  })
})
