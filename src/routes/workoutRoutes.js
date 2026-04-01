import express from "express";
const router = express.Router();

export default (prisma) => {
  // Create workout
  router.post("/", async (req, res) => {
    try {
      const { userId, exerciseId, reps, sets } = req.body;

      if (!userId || !exerciseId) {
        return res
          .status(400)
          .json({ error: "userId and exerciseId required" });
      }

      const workout = await prisma.workout.create({
        data: {
          userId,
          exerciseId,
          reps,
          sets,
        },
      });

      res.status(201).json(workout);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create workout" });
    }
  });

  // Get all workouts (with relations 👇)
  router.get("/", async (req, res) => {
    try {
      const { userId } = req.query;

      const workouts = await prisma.workout.findMany({
        where: userId ? { userId: Number(userId) } : {}, // If userId is provided, filter by it
        include: {
          user: true,
          exercise: true,
          // SELECT *
          // FROM Workout
          // JOIN User ON Workout.userId = User.id
          // JOIN Exercise ON Workout.exerciseId = Exercise.id;
        },
      });

      res.json(workouts);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch workouts" });
    }
  });

  return router;
};
