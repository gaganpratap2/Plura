import 'server-only'

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL environment variable is not set.");
}

// Customized pg pool tuned for Neon (serverless Postgres):
// - connectionTimeoutMillis is raised so the query survives Neon's compute
//   activation on cold starts instead of failing with "Server has closed
//   the connection".
// - idleTimeoutMillis is raised above pg's 10s default so we don't churn
//   connections, which previously caused the server to close idle conns.
// - ssl is not forced here; honour whatever ciphers the URL specifies.
const pool = new Pool({
  connectionString,
  connectionTimeoutMillis: 15000,
  idleTimeoutMillis: 30000,
  max: 5,
});

pool.on("error", (err) => {
  console.error("Unexpected error on idle Postgres client", err);
});

const adapter = new PrismaPg(pool);

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient;
};

export const db =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
