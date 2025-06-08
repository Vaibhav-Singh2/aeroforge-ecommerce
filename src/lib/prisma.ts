import { PrismaClient } from "@prisma/client";
import { setupPrismaMiddleware } from "./admin/prisma-middleware";

const globalForPrisma = global as unknown as {
  prisma: PrismaClient;
};

// Initialize PrismaClient
const prisma = globalForPrisma.prisma || new PrismaClient();

// Apply middleware for image cleanup if not already applied
if (!globalForPrisma.prisma) {
  setupPrismaMiddleware(prisma);
}

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
