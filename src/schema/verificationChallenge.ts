import { sqliteTable } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";
import * as t from "drizzle-orm/sqlite-core";

export const verificationChallenge = sqliteTable("verificationChallenge", {
        userId: t.int("user_id").notNull(),
        code: t.text("code").notNull(),
        expiresAt: t.text("expires_at").default(sql`(CURRENT_TIMESTAMP + '1 hour')`),
        createdAt: t.text("created_at").default(sql`(CURRENT_TIMESTAMP)`),
        isUsed: t.int("is_used", {mode: "boolean"}).default(false),
        type: t.text("type").notNull()
})