import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

export default (prisma) => {
  router.post("/", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const { type, calories } = req.body;

      const MEAL_TYPES = ["breakfast", "lunch", "dinner", "snack"];

      const date = new Date();

      if (!type || !MEAL_TYPES.includes(type)) {
        return res.status(400).json({ error: "Invalid meal type specified." });
      }

      if (!calories || calories < 0) {
        return res.status(400).json({ error: "Invalid calories value." });
      }

      const meal = await prisma.meal.create({
        data: {
          userId,
          date,
          type,
          calories,
        },
      });

      res.status(201).json(meal);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create meal" });
    }
  });

  router.get("/", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;
      const meals = await prisma.meal.findMany({
        where: { userId: Number(userId) },
      });
      res.json(meals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch meals" });
    }
  });

  return router;
};
