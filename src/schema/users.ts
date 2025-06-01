import { sqliteTable } from "drizzle-orm/sqlite-core"
import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const users = sqliteTable('users', {
    id: t.int().primaryKey({autoIncrement: true}),
    username: t.text("username").notNull(),
    email: t.text("email").notNull(),
    password: t.text("password").notNull(),
    createdAt: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
    updatedAt: t.text("updated_at").default(sql`(CURRENT_TIMESTAMP)`),
    activeAt: t.text("active_at").default(sql`(CURRENT_TIMESTAMP)`),
    lastLogin: t.text("last_login").default(sql`(CURRENT_TIMESTAMP)`),
    passwordAt: t.text("password_at").default(sql`(CURRENT_TIMESTAMP)`),
    isActive: t.int("is_active", {mode: "boolean"}).default(true),
    isAdmin: t.int("is_admin", {mode: "boolean"}).default(false),
    isVerified: t.int("is_verified", {mode: "boolean"}).default(false),
    isBanned: t.int("is_banned", {mode: "boolean"}).default(false),
    isDeleted: t.int("is_deleted", {mode: "boolean"}).default(false),
    isSuspended: t.int("is_suspended", {mode: "boolean"}).default(false),
    isLocked: t.int("is_locked", {mode: "boolean"}).default(false),
    isTwoFactorEnabled: t.int("is_two_factor_enabled", {mode: "boolean"}).default(false),
    twoFactorSecret: t.text("two_factor_secret"),
    profilePicture: t.text("profile_picture"),
    bio: t.text("bio")
});