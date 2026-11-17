// One place to import every model (and their relationships) from.
import { sequelize } from "./db.js";
import { User } from "./userModel.js";
import { Account } from "./accountModel.js";
import { AccountHolder } from "./holderModel.js";
import { BankTransaction } from "./transactionModel.js";
import { AuditTrail } from "./auditModel.js";
import { LoginAttempt } from "./loginAttemptModel.js";

Account.hasOne(AccountHolder, { foreignKey: "account_id", as: "holder", onDelete: "CASCADE" });
AccountHolder.belongsTo(Account, { foreignKey: "account_id", as: "account" });

Account.hasMany(BankTransaction, { foreignKey: "account_id", as: "transactions" });
BankTransaction.belongsTo(Account, { foreignKey: "account_id", as: "account" });

// constraints:false → the audit log keeps its rows even if a user is removed
AuditTrail.belongsTo(User, { foreignKey: "user_id", as: "user", constraints: false });

export { sequelize, User, Account, AccountHolder, BankTransaction, AuditTrail, LoginAttempt };
