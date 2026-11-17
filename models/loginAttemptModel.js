import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

export const LoginAttempt = sequelize.define(
  "LoginAttempt",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100) },
    ip_address: { type: DataTypes.STRING(45) },
    success: { type: DataTypes.BOOLEAN, defaultValue: false },
    attempted_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  },
  { tableName: "login_attempts", timestamps: false }
);
