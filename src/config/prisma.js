import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

// Create adapter with connection string
const adapter = new PrismaPg({ connectionString });

// Pass adapter to PrismaClient
export const prisma = new PrismaClient({ adapter });
