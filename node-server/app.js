// node-server/app.js
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js"; // החיבור ל‑MongoDB

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// חיבור ל‑MongoDB
connectDB();

// נתיב בדיקה
app.get("/", (req, res) => {
  res.send("Server is running!!!!!");
});

// הגדרת פורט והפעלת השרת
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
