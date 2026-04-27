// apps/api/src/app.ts

import { Hono } from "hono";

import { auth } from "./auth/auth.js";
import { db } from "./db/client.js";
import { healthChecks } from "./db/schema.js";
import { adminRoutes } from "./routes/admin.routes.js";
import { invitationRoutes } from "./routes/invitations.routes.js";

export const app = new Hono();

app.get("/", (c) => {
  return c.json({
    name: "skill-port-api",
    status: "ok",
  });
});

app.get("/health", (c) => {
  return c.json({ status: "ok" });
});

app.on(["GET", "POST"], "/api/auth/**", (c) => {
  return auth.handler(c.req.raw);
});

app.get("/health/db", async (c) => {
  const id = globalThis.crypto.randomUUID();

  const [record] = await db
    .insert(healthChecks)
    .values({ id, message: "ok" })
    .returning();

  return c.json({
    status: "ok",
    record,
  });
});

app.route("/api/admin", adminRoutes);
app.route("/api/invitations", invitationRoutes);
