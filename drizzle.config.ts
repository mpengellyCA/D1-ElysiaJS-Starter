import { defineConfig } from "drizzle-kit";

export default defineConfig({
    dialect: "sqlite",
    schema: "./src/schema/*",
    out: "./drizzle",
    dbCredentials: {
        url: './db/mydb.sqlite',
    }
});