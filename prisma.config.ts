// prisma.config.js
import dotenv from "dotenv";
dotenv.config();

export default {
  adapter: {
    provider: "postgresql",
    url: process.env.DATABASE_URL
  }
};