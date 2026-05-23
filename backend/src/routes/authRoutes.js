import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const router = express.Router();

export default (prisma) => {
  router.post("/register", async (req, res) => {
    try {
      const { email, password, name } = req.body;

      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ error: "User already exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: {
          email,
          name,
          password: hashedPassword,
        },
      });

      res.json({ message: "User created", userId: user.id });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Register failed" });
    }
  });

  router.post("/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);

      if (!isValid) {
        return res.status(400).json({ error: "Invalid credentials" });
      }

      const token = jwt.sign(
        { userId: user.id, email: user.email },
        "SECRET_KEY",
        { expiresIn: "7d" },
      );

      res.json({ token });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: "Login failed" });
    }
  });

  return router;
};
