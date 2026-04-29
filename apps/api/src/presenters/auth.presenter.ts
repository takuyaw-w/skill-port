import type { AuthUser } from "../types/hono.js";

export function presentAuthUser(user: AuthUser) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
