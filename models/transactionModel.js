import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

export const BankTransaction = sequelize.define(
  "BankTransaction",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    account_id: { type: DataTypes.INTEGER, allowNull: false },
    type: { type: DataTypes.ENUM("deposit", "withdrawal", "transfer"), allowNull: false },
    amount: { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    description: { type: DataTypes.STRING(255), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  },
  { tableName: "transactions", timestamps: false }
);
