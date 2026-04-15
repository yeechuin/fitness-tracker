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

  router.get("/stats", async (req, res) => {
    try {
      const { userId } = req.query;

      // Dynamic query building for conditional filtering
      const where = userId ? { userId: Number(userId) } : {};

      const totalWorkouts = await prisma.workout.count({ where });

      const repsData = await prisma.workout.aggregate({
        where,
        _sum: { reps: true },
      });

      const topExercisesRaw = await prisma.workout.groupBy({
        by: ["exerciseId"],
        where,
        _count: { exerciseId: true },
        orderBy: { _count: { exerciseId: "desc" } },
      });
      // SELECT exerciseId, COUNT(*)
      // FROM Workout
      // GROUP BY exerciseId;

      const exerciseIds = topExercisesRaw.map((e) => e.exerciseId);
      // Find all exercises where the id is inside exerciseIds list
      const exercises = await prisma.exercise.findMany({
        where: {
          id: { in: exerciseIds },
        },
      });

      const topExercises = topExercisesRaw.map((item) => {
        const exercise = exercises.find((e) => e.id === item.exerciseId);
        return {
          exercise: exercise?.name || "Unknown",
          count: item._count.exerciseId,
        };
      });

      res.json({
        totalWorkouts,
        totalReps: repsData._sum.reps || 0,
        topExercises,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch workout stats" });
    }
  });

  return router;
};
