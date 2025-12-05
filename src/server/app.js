import express from "express";
import { prisma } from "../config/prisma.js";

const app = express();

app.use(express.json());

// Get
app.get("/test-users", async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

//Create
app.post("/test-create-user", async (req, res) => {
  try {
    const user = await prisma.user.create({
      data: {
        email: "test@example.com",
        firstname: "Test",
        lastname: "User",
      },
    });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default app;
