import { Sequelize } from "sequelize";

// Defaults match a typical Laragon / XAMPP setup. Override with environment variables if needed:
//   DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASS
export const DB = {
  host: process.env.DB_HOST || "127.0.0.1",
  port: Number(process.env.DB_PORT) || 3306,
  name: process.env.DB_NAME || "bank_app",
  user: process.env.DB_USER || "root",
  pass: process.env.DB_PASS ?? "",
};

export const sequelize = new Sequelize(DB.name, DB.user, DB.pass, {
  host: DB.host,
  port: DB.port,
  dialect: "mysql",
  logging: false,
  // Return DATETIME columns exactly as stored ("2026-05-08 11:05:24") — no timezone surprises.
  dialectOptions: { dateStrings: true, typeCast: true },
});
