import {createInsertSchema, createSelectSchema, createUpdateSchema} from "drizzle-typebox";
import {table} from "../schema";
import {t} from "elysia";

const protectedUser: object = {
    id: t.Number(),
    email: t.String({ format: 'email' }),
    username: t.String({ minLength: 3, maxLength: 32 }),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' }),
    activeAt: t.String({ format: 'date-time' }),
    lastLogin: t.String({ format: 'date-time' }),
    passwordAt: t.String({ format: 'date-time' }),
    isActive: t.Boolean(),
    isAdmin: t.Boolean(),
    profilePicture: t.Optional(t.String()),
    bio: t.Optional(t.String()),
}

const privilegedUser: object = {
    id: t.Number(),
    email: t.String({ format: 'email' }),
    username: t.String({ minLength: 3, maxLength: 32 }),
    password: t.String(),
    createdAt: t.String({ format: 'date-time' }),
    updatedAt: t.String({ format: 'date-time' }),
    activeAt: t.String({ format: 'date-time' }),
    lastLogin: t.String({ format: 'date-time' }),
    passwordAt: t.String({ format: 'date-time' }),
    isActive: t.Boolean(),
    isAdmin: t.Boolean(),
    isVerified: t.Boolean(),
    isBanned: t.Boolean(),
    isDeleted: t.Boolean(),
    isSuspended: t.Boolean(),
    isLocked: t.Boolean(),
    isTwoFactorEnabled: t.Boolean(),
    twoFactorSecret: t.Optional(t.String()),
    profilePicture: t.Optional(t.String()),
    bio: t.Optional(t.String()),
}

export const _viewUser = createSelectSchema(table.users, protectedUser);
export const _updateUser = createUpdateSchema(table.users, protectedUser);

export const _viewPrivUser = createSelectSchema(table.users, privilegedUser);
export const _updatePrivUser = createUpdateSchema(table.users, privilegedUser);

export const _createUser =  createInsertSchema(table.users,{
    email: t.String({ format: 'email' }),
    username: t.String({ minLength: 3, maxLength: 32 }),
    password: t.String({ minLength: 6, maxLength: 100 }),
})
export const _loginUser = createSelectSchema(table.users, {
    username: t.String({ minLength: 3, maxLength: 32 }),
    password: t.String({ minLength: 6, maxLength: 100 }),
})

export type _viewUser = typeof _viewUser;
export type _updateUser = typeof _updateUser;
export type _viewPrivUser = typeof _viewPrivUser;
export type _updatePrivUser = typeof _updatePrivUser;
export type _createUser = typeof _createUser;
export type _loginUser = typeof _loginUser;