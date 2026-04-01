import express from "express";
const router = express.Router();

export default (prisma) => {
  //CREATE EXERCISES
  router.post("/", async (req, res) => {
    try {
      const { name } = req.body;

      if (!name) {
        return res.status(400).json({ error: "Exercise name is required" });
      }

      const exercise = await prisma.exercise.create({
        data: {
          name,
        },
      });
      res.status(201).json(exercise);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to create exercise" });
    }
  });

  //GET EXERCISES
  router.get("/", async (req, res) => {
    try {
      const exercises = await prisma.exercise.findMany();
      res.json(exercises);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Failed to fetch exercises" });
    }
  });

  return router;
};
