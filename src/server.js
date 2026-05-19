import dotenv from "dotenv";
dotenv.config();

import express from "express";
import { PrismaClient } from "@prisma/client";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import mealRoutes from "./routes/mealRoutes.js";
import nutritionRoutes from "./routes/nutritionRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import aiRoutes from "./routes/aiRoutes.js";

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
// Use routes
app.use("/auth", authRoutes(prisma));
app.use("/exercises", exerciseRoutes(prisma));
app.use("/users", userRoutes(prisma));
app.use("/profile", profileRoutes(prisma));
app.use("/workouts", workoutRoutes(prisma));
app.use("/stats", statsRoutes(prisma));
app.use("/meals", mealRoutes(prisma));
app.use("/nutrition", nutritionRoutes(prisma));
app.use("/ai", aiRoutes(prisma));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
