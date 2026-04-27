import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { openAPI, admin } from "better-auth/plugins";
import { db } from "../db/client.js";
import { env } from "../config/env.js";
import { ac, adminRole, employeeRole } from './permissions.js'

export const auth = betterAuth({
  baseURL: env.BETTER_AUTH_URL,
  secret: env.BETTER_AUTH_SECRET,

  database: drizzleAdapter(db, { provider: 'pg' }),

  emailAndPassword: {
    enabled: true,
    disableSignUp: true
  },

  plugins: [
    admin({
      ac,
      roles: {
        admin: adminRole,
        employee: employeeRole
      },
      defaultRole: "employee",
      adminRoles: ["admin"],
    }),
    openAPI()
  ]
})
