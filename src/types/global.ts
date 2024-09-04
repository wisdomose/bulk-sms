import { roles } from "../middleware/protectedRoute";
import { TAdmin } from "../res/admin/admin.model";
import { TUser } from "../res/users/users.model";

export type UserLocal = {
  user: Omit<TUser, "password">;
  role: "user";
};
export type AdminLocal = {
  admin: Omit<TAdmin, "password">;
  role: "admin";
};
export type LoginJWT = {
  _id: string;
  role: roles;
  iat: number;
  exp: number;
} | null;
export type GlobalLocal = {
  user?: UserLocal["user"];
  admin?: AdminLocal["admin"];
  role: roles;
};
