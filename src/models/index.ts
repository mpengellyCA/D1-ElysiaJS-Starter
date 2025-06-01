import * as User from "./User";

export const models = {
  User,
} as const;

export const m = models;
export type models = typeof models;
export type m = typeof m;
