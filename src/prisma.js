import pkg from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const { PrismaClient } = pkg;

const prisma = new PrismaClient({
  adapter: {
    provider: "postgresql",
    url: process.env.DATABASE_URL
  }
});

export default prisma;