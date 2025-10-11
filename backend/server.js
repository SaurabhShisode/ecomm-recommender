import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import recommendRouter from "./routes/recommendRoutes.js";
import { pool } from "./db/db.js";

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// test route
app.get("/", (req, res) => res.send("E-commerce Recommender API Running 🚀"));
app.use("/api/recommend", recommendRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
