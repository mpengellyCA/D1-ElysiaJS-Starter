import { InferSelectModel } from "drizzle-orm";
import { users } from "../schema/users";
import { Model } from "./baseModel";

// Example User model
export type UserType = InferSelectModel<typeof users>;

export class User extends Model<typeof users, InferSelectModel<typeof users>> {
  static table = users;
  id: number;
  email: string;
  username: string;
  password: string;
  createdAt: string;
  updatedAt: string;
  activeAt: string;
  lastLogin: string;
  passwordAt: string;
  isActive: boolean;
  isAdmin: boolean;
  isVerified: boolean;
  isBanned: boolean;
  isDeleted: boolean;
  isSuspended: boolean;
  isLocked: boolean;
  isTwoFactorEnabled: boolean;
  twoFactorSecret?: string;
  profilePicture?: string;
  bio?: string;
}
