import { defineConfig, type PrismaConfig } from "prisma/config";
import "dotenv/config";

const config: PrismaConfig = defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL,
  },
});

export default config;
