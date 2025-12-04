import app from "./server/app.js";
import { pool } from "./config/db.js";

const PORT = process.env.PORT || 3000;

async function start() {
  try {
    await pool.query("SELECT NOW()");
    console.log("Connected to PostgreSQL");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (err) {
    console.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

start();
