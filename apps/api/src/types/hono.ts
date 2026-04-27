import { auth } from "../auth/auth.js";

export type AuthSession = Awaited<ReturnType<typeof auth.api.getSession>>
export type AuthUser = NonNullable<AuthSession>["user"];

export type AppVariables = {
  user: AuthUser
}
