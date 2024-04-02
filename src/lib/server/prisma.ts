import { PrismaClient } from "@prisma/client";

// Prisma singleton
const prisma = new PrismaClient();

export { prisma };

