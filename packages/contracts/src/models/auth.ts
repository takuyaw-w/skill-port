export type AuthRole = "admin" | "employee";

export type AuthUserResponse = {
  id: string;
  email: string;
  name: string | null;
  role: AuthRole;
};
