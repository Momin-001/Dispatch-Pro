import { DATABASE_URL } from "@/lib/constants"
import { defineConfig } from "drizzle-kit"

export default defineConfig({
  schema: "./lib/db/schema/index.js",
  out: "./lib/db/migrations",
  dialect: "postgresql",
  dbCredentials: {
    url: DATABASE_URL,
  },
})
