import express from "express";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import exerciseRoutes from "./routes/exerciseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import workoutRoutes from "./routes/workoutRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";

dotenv.config();

const app = express();
const prisma = new PrismaClient();

app.use(express.json());
// Use routes
app.use("/exercises", exerciseRoutes(prisma));
app.use("/users", userRoutes(prisma));
app.use("/workouts", workoutRoutes(prisma));
app.use("/stats", statsRoutes(prisma));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
