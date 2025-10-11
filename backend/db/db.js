import pkg from "pg";
import dotenv from "dotenv";
dotenv.config();

const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Retool DB requires SSL
});

pool.on("connect", () => console.log("✅ Connected to Retool PostgreSQL Database"));
