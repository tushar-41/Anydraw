import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import "dotenv/config";

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://neondb_owner:npg_RW7EAFuqN5dK@ep-holy-tree-ah7cm87z-pooler.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

if (!connectionString) throw new Error("DATABASE_URL missing");

const adapter = new PrismaPg({ connectionString });

export const prismaClient = new PrismaClient({ adapter });

console.log(process.env.DATABASE_URL);
