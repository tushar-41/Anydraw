import { z } from "zod";

export const UserSchema = z.object({
  name: z.string(),
  password: z.string().min(5).max(15),
  username: z.string().min(3).max(20),
});

export const SigninSchema = z.object({
  username: z.string().min(3).max(20),
  password: z.string().min(5).max(15),
});

export const CreateroomSchema = z.object({
  name: z.string().min(3).max(20),
});
