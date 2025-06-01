import {createInsertSchema, createSelectSchema, createUpdateSchema} from "drizzle-typebox";
import {table} from "../schema";
import {t} from "elysia";

export const _createVerificationChallenge = createInsertSchema(table.verificationChallenge, {
    userId: t.Number(),
    code: t.String(),
    expiresAt: t.String({ format: "date-time" }),
    createdAt: t.String({ format: "date-time" }),
    isUsed: t.Boolean(),
    type: t.String(), // e.g., "email", "phone"
})

export const _viewVerificationChallenge = createSelectSchema(table.verificationChallenge, {
    userId: t.Number(),
    code: t.String(),
    expiresAt: t.String({ format: "date-time" }),
    createdAt: t.String({ format: "date-time" }),
    isUsed: t.Boolean(),
    type: t.String(), // e.g., "email", "phone"
})

export const _updateVerificationChallenge = createUpdateSchema(table.verificationChallenge, {
    userId: t.Number(),
    code: t.String(),
    expiresAt: t.String({ format: "date-time" }),
    createdAt: t.String({ format: "date-time" }),
    isUsed: t.Boolean(),
    type: t.String(), // e.g., "email", "phone"
})


export type _createVerificationChallenge = typeof _createVerificationChallenge;
export type _viewVerificationChallenge = typeof _viewVerificationChallenge;
export type _updateVerificationChallenge = typeof _updateVerificationChallenge;