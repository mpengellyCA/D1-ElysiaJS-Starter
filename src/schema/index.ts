import { users } from "./users";
import {verificationChallenge} from "./verificationChallenge";

export const table = {
  users, verificationChallenge
} as const;

export type table = typeof table;
