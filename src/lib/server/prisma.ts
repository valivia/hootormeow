import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "@prisma/client";

// Prisma singleton
const adapter = new PrismaBetterSqlite3({ url: `${process.env.DATABASE_URL}` });
console.log(`Using database at ${process.env.DATABASE_URL}`);
const prisma = new PrismaClient({ adapter });

export { prisma };
