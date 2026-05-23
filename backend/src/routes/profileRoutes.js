import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
const router = express.Router();

export default (prisma) => {
  router.patch("/", authMiddleware, async (req, res) => {
    try {
      const userId = req.user.userId;

      const { gender, age, height, weight, calorieGoal } = req.body;

      const updateData = {};

      if (gender !== undefined) updateData.gender = gender;
      if (age !== undefined) updateData.age = age;
      if (height !== undefined) updateData.height = height;
      if (weight !== undefined) updateData.weight = weight;
      if (calorieGoal !== undefined) updateData.calorieGoal = calorieGoal;

      const updatedUser = await prisma.user.update({
        where: { id: Number(userId) },
        data: updateData,
      });

      res.json({
        id: updatedUser.id,
        email: updatedUser.email,
        name: updatedUser.name,
        gender: updatedUser.gender,
        age: updatedUser.age,
        height: updatedUser.height,
        weight: updatedUser.weight,
        calorieGoal: updatedUser.calorieGoal,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch users" });
    }
  });

  return router;
};
