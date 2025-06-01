import { users } from "./users";

export const table = {
  users,
} as const;

export type table = typeof table;
