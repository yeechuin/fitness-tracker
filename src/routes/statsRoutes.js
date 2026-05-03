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

      function getPreviousTimeKey(date, period) {
        const d = new Date(date);

        if (period === "y") {
          d.setFullYear(d.getFullYear() - 1);
        }

        if (period === "m") {
          d.setMonth(d.getMonth() - 1);
        }

        if (period === "w") {
          d.setDate(d.getDate() - 7);
        }

        return getTimeKey(d, period);
      }

      const now = new Date();
      const currentPeriodKey = getTimeKey(now, timePeriod);
      const previousPeriodKey = getPreviousTimeKey(now, timePeriod);

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
      var volumeMap = {}; //current data
      var previousMap = {}; //prev data for comparison
      var prevVolumeByExercise = [];

      workouts.forEach((workout) => {
        const exerciseName = workout.exercise.name;
        const volume = workout.reps * workout.sets;

        const workoutKey = getTimeKey(workout.date, timePeriod);

        if (workoutKey === currentPeriodKey) {
          if (!volumeMap[exerciseName]) {
            volumeMap[exerciseName] = 0;
          }
          volumeMap[exerciseName] += volume;
        }

        if (workoutKey === previousPeriodKey) {
          if (!previousMap[exerciseName]) {
            previousMap[exerciseName] = 0;
          }
          previousMap[exerciseName] += volume;
        }
      });

      const allExercises = new Set([
        ...Object.keys(volumeMap),
        ...Object.keys(previousMap),
      ]);

      volumeByExercise = Array.from(allExercises).map((exerciseName) => {
        const current = volumeMap[exerciseName] || 0; //find exercise volume for current period, default to 0 if not found
        const previous = previousMap[exerciseName] || 0; //find exercise volume for previous period, default to 0 if not found

        let changePercent = 0;

        if (previous === 0) {
          // handle edge cases to avoid division by zero
          changePercent = current > 0 ? 100 : 0;
        } else {
          changePercent = ((current - previous) / previous) * 100;
        }

        return {
          exerciseName,
          current,
          previous,
          changePercent,
        };
      });

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
