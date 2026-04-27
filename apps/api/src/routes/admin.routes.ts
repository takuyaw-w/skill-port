import { Hono } from "hono";
import { requireAdmin } from "../middleware/require-admin.js";
import { adminEmployeesRoutes } from "./admin/employees.routes.js";

export const adminRoutes = new Hono();

adminRoutes.use("*", requireAdmin);

adminRoutes.get("/me", async (c) => {
  return c.json({
    status: "ok",
    scope: "admin",
  });
});

adminRoutes.route("/employees", adminEmployeesRoutes);
