import { DataTypes, Sequelize } from "sequelize";
import { sequelize } from "./db.js";

export const AuditTrail = sequelize.define(
  "AuditTrail",
  {
    id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    user_id: { type: DataTypes.INTEGER, allowNull: true },
    username: { type: DataTypes.STRING(100), defaultValue: "system" },
    action: { type: DataTypes.STRING(50), allowNull: false },
    table_name: { type: DataTypes.STRING(100), allowNull: true },
    record_id: { type: DataTypes.INTEGER, allowNull: true },
    old_value: { type: DataTypes.TEXT, allowNull: true },
    new_value: { type: DataTypes.TEXT, allowNull: true },
    ip_address: { type: DataTypes.STRING(45), allowNull: true },
    created_at: { type: DataTypes.DATE, defaultValue: Sequelize.literal("CURRENT_TIMESTAMP") },
  },
  { tableName: "audit_trail", timestamps: false }
);
