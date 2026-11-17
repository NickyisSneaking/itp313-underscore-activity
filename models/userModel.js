import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

export const User = sequelize.define(
  "User",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    username: { type: DataTypes.STRING(100), allowNull: false, unique: true },
    password: { type: DataTypes.STRING(255), allowNull: false },
    role: { type: DataTypes.ENUM("admin", "user", "guest"), defaultValue: "guest" },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
    is_locked: { type: DataTypes.BOOLEAN, defaultValue: false },
    locked_until: { type: DataTypes.DATE, allowNull: true },
    failed_attempts: { type: DataTypes.INTEGER, defaultValue: 0 },
  },
  { tableName: "users", timestamps: false }
);

export { sequelize };
