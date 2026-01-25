import { Pool } from "pg";

const HOST = process.env.DB_HOST;
const USER = process.env.DB_USER;
const PASSWORD = process.env.DB_PASSWORD; 
const DATABASE = process.env.DB_DATABASE;
const DB_CONNECTION_LIMIT = parseInt(
  process.env.DB_CONNECTION_LIMIT ?? "10",
  10
);


if (!HOST || !USER || !DATABASE) {
  throw new Error("Missing required database environment variables.");
};

if (Number.isNaN(DB_CONNECTION_LIMIT)) {
  throw new Error("DB_CONNECTION_LIMIT must be a number");
};

// Create Postgres connection pool
const pool = new Pool({
  host: HOST,
  user: USER,
  password: PASSWORD,
  database: DATABASE,
  max: DB_CONNECTION_LIMIT,
  port: 5432,
});

// Test connection when pool is created
export const initDb = async () => {
  await pool.query("SELECT 1");
  console.log("Postgres db connected");
};

export default pool;