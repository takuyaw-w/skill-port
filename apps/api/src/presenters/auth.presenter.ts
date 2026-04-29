import type { AuthUser } from "../types/hono.js";

export type AuthUserResponse = {
  id: string;
  email: string;
  name: string;
  role: AuthUser["role"];
};

export function presentAuthUser(user: AuthUser): AuthUserResponse {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
