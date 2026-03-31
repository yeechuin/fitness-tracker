import express from "express";
import prisma from "../prisma.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

// Add workout
router.post("/", authMiddleware, async (req, res) => {
  const { exerciseId, weight, reps, sets, date } = req.body;
  const workout = await prisma.workout.create({
    data: {
      userId: req.userId,
      exerciseId,
      weight,
      reps,
      sets,
      date: new Date(date)
    }
  });
  res.json(workout);
});

// Get user workout history
router.get("/history", authMiddleware, async (req, res) => {
  const workouts = await prisma.workout.findMany({
    where: { userId: req.userId },
    include: { exercise: true },
    orderBy: { date: "desc" }
  });
  res.json(workouts);
});

export default router;