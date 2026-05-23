import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import { calcBMR, calcTDEE } from "../utils/calcEnergy.js";
const router = express.Router();

export default (prisma) => {
  router.get("/daily", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const user = await prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      const bmr = calcBMR(user);
      const tdee = bmr ? calcTDEE(bmr, "moderate") : null;

      const { date } = req.query;
      const targetDate = date ? new Date(date) : new Date();

      const startOfDay = new Date(targetDate);
      startOfDay.setHours(0, 0, 0, 0);

      const endOfDay = new Date(targetDate);
      endOfDay.setHours(23, 59, 59, 999);

      const calorieGoal = await prisma.user.findUnique({
        where: { id: Number(userId) },
        select: { calorieGoal: true },
      });

      const nutrition = await prisma.meal.findMany({
        where: {
          userId,
          date: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      });

      let breakfast = 0;
      let lunch = 0;
      let dinner = 0;
      let snack = 0;
      let total = 0;

      nutrition.forEach((element) => {
        total += element.calories;
        switch (element.type) {
          case "breakfast":
            breakfast += element.calories;
            break;
          case "lunch":
            lunch += element.calories;
            break;
          case "dinner":
            dinner += element.calories;
            break;
          case "snack":
            snack += element.calories;
            break;
        }
      });

      const mealResult = { breakfast, lunch, dinner, snack, total };

      const goal = user?.calorieGoal ?? tdee ?? null;

      let remaining = null;
      let percentage = null;
      let status = null;

      if (goal) {
        remaining = goal - total;
        percentage = (total / goal) * 100;

        if (percentage >= 100) status = "exceeded";
        else if (percentage >= 80) status = "warning";
        else status = "safe";
      }

      const nutritionTotal = {
        userId,
        date: targetDate,

        calories: total,
        calorieGoal: goal,

        remaining,
        percentage,
        status,

        bmr,
        tdee,

        mealBreakdown: mealResult,
      };

      res.json(nutritionTotal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch nutrition data" });
    }
  });
  return router;
};
