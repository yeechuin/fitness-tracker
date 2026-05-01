import express from "express";
const router = express.Router();

export default (prisma) => {
  router.get("/volume", async (req, res) => {
    try {
      const { userId, period } = req.query;

      const timePeriod = period || "all";

      if (!userId) {
        return res
          .status(400)
          .json({ error: "userId query parameter is required" });
      }

      function getTimeKey(date, period) {
        const d = new Date(date);

        const year = d.getFullYear();
        const month = d.getMonth() + 1;
        const paddedMonth = String(month).padStart(2, "0");
        const day = d.getDate();

        if (period === "y") {
          return `${year}`;
        }

        if (period === "m") {
          return `${year}-${paddedMonth}`;
        }

        if (period === "w") {
          const week = Math.ceil(day / 7); // simple week calc
          return `${year}-W${week}`;
        }

        return "all";
      }

      const workouts = await prisma.workout.findMany({
        where: userId ? { userId: Number(userId) } : {},
        select: {
          reps: true,
          sets: true,
          date: true,
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
        const timeKey = getTimeKey(workout.date, timePeriod);

        if (!volumeMap[exerciseName]) {
          volumeMap[exerciseName] = {};
        }

        if (!volumeMap[exerciseName][timeKey]) {
          volumeMap[exerciseName][timeKey] = 0;
        }

        volumeMap[exerciseName][timeKey] += volume;
      });

      volumeByExercise = Object.entries(volumeMap).map(
        ([exerciseName, timeData]) => ({
          exerciseName,
          data: timeData,
        }),
      );

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
