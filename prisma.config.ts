import "dotenv/config";

import { defineConfig } from "prisma/config";

const fallbackDatabaseUrl =
  "postgresql://postgres:postgres@localhost:5432/survivor_mundial";

export default defineConfig({
  schema: "prisma/schema.prisma",
  datasource: {
    url: process.env.DATABASE_URL ?? fallbackDatabaseUrl
  }
});
