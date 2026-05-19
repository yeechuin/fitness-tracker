import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { askAI } from "../services/aiServices.js";
const router = express.Router();

export default (prisma) => {
  router.post("/chat", authMiddleware, async (req, res) => {
    try {
      const { message } = req.body;
      const userId = req.user.userId;

      await prisma.chatMessage.create({
        data: {
          userId,
          role: "user",
          content: message,
        },
      });

      const startOfDay = new Date();
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date();
      endOfDay.setHours(23, 59, 59, 999);

      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: {
          age: true,
          weight: true,
          height: true,
          gender: true,
          calorieGoal: true,
          name: true,
        },
      });

      const todayMeals = await prisma.meal.findMany({
        where: {
          userId,
          date: { gte: startOfDay, lte: endOfDay },
        },
      });

      const recentWorkouts = await prisma.workout.findMany({
        where: { userId: Number(userId) },
        select: {
          reps: true,
          sets: true,
          exercise: { select: { name: true } },
        },
        orderBy: { date: "desc" },
        take: 5,
      });

      const history = await prisma.chatMessage.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 10,
      });

      history.reverse();

      const aiResponse = await askAI(prisma, {
        userId,
        user,
        todayMeals,
        recentWorkouts,
        history,
        message,
      });

      res.json({ reply: aiResponse });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to process message" });
    }
  });

  return router;
};
