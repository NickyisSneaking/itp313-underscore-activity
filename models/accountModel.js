import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

const NOW = Sequelize.literal("CURRENT_TIMESTAMP");

export const Account = sequelize.define(
  "Account",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    AccountNumber: { type: DataTypes.STRING(50) },
    PIN: { type: DataTypes.STRING(255), allowNull: false },
    TotalBalance: { type: DataTypes.DECIMAL(10, 2), defaultValue: 0 },
    status: { type: DataTypes.STRING(20), defaultValue: "active" },
    is_deleted: { type: DataTypes.BOOLEAN, defaultValue: false },
    deleted_at: { type: DataTypes.DATE, allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: NOW },
    updated_at: { type: DataTypes.DATE, defaultValue: NOW },
  },
  { tableName: "accounts", timestamps: false }
);
