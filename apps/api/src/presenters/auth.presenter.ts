import type { AuthUserResponse } from "@skill-port/contracts";

import type { AuthUser } from "../types/hono.js";

export function presentAuthUser(user: AuthUser): AuthUserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name ?? null,
    role: user.role as AuthUserResponse["role"],
  };
}
