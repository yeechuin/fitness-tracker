import express from "express";
const router = express.Router();

export default (prisma) => {
  router.get("/volume", async (req, res) => {
    try {
      const { userId } = req.query;
      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId query parameter is required" });
      }
      const workouts = await prisma.workout.findMany({
        where: userId ? { userId: Number(userId) } : {},
        select: {
          reps: true,
          sets: true,
          user: {
            select: {
              name: true,
            },
          },
          exercise: {
            select: {
              name: true,
            },
          },
        },
      });

      var volumeByExercise = [];
      var volumeMap = {};
      workouts.forEach((workout) => {
        const exerciseName = workout.exercise.name;
        const volume = workout.reps * workout.sets;
        const userName = workout.user.name;

        if (!volumeMap[exerciseName]) {
          volumeMap[exerciseName] = { exerciseName, volume };
        } else {
          volumeMap[exerciseName].volume += volume;
        }
      });

      volumeByExercise = Object.values(volumeMap);

      const finalData = {
        userName: workouts[0]?.user.name,
        volumeByExercise,
      };

      res.json(finalData);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch stats" });
    }
  });

  return router;
};
