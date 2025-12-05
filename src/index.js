import app from "./server/app.js";
import { prisma } from "./config/prisma.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

start();
