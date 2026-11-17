import { fn, col, literal } from "sequelize";
import { sequelize, Account, BankTransaction } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import { TX_TYPES, parseId, parseMoney, parseTxType, cleanText, toCents, fromCents } from "../utils/validators.js";
import { MAX_MONEY } from "../config/security.js";
import { peso } from "../utils/hbsHelpers.js";
import { logAction } from "./auditService.js";

// Records a deposit / withdrawal / transfer and updates the balance in ONE database transaction,
// with the account row locked — so two people can never overdraw the same account at once.
export const recordTransaction = async (rawAccountId, input, actor) => {
  const accountId = parseId(rawAccountId);
  const type = parseTxType(input.type);
  const amount = parseMoney(input.amount, { allowZero: false });
  const description = cleanText(input.description).slice(0, 255);

  const problems = [];
  if (!accountId) problems.push("That account link isn't valid.");
  if (!type) problems.push("Please choose deposit, withdrawal or transfer.");
  if (amount === null) problems.push("Please enter an amount greater than zero, like 100 or 49.50.");
  if (problems.length) throw new AppError(problems.join(" "));

  const result = await sequelize.transaction(async (t) => {
    const account = await Account.findOne({
      where: { id: accountId, is_deleted: false },
      transaction: t,
      lock: t.LOCK.UPDATE,
    });
    if (!account) throw new AppError("We couldn't find that account. It may have been deleted.", 404);

    const oldCents = toCents(account.TotalBalance);
    const newCents = type === "deposit" ? oldCents + toCents(amount) : oldCents - toCents(amount);

    if (newCents < 0) {
      throw new AppError(`Not enough money in this account. The balance is ${peso(fromCents(oldCents))}.`);
    }
    if (fromCents(newCents) > MAX_MONEY) throw new AppError("That deposit would make the balance larger than the system allows.");

    const tx = await BankTransaction.create(
      { account_id: accountId, type, amount, description: description || null },
      { transaction: t }
    );
    await account.update(
      { TotalBalance: fromCents(newCents), updated_at: literal("CURRENT_TIMESTAMP") },
      { transaction: t }
    );
    return { txId: tx.id, oldBalance: fromCents(oldCents), newBalance: fromCents(newCents), accountNumber: account.AccountNumber };
  });

  await logAction(actor, "TRANSACTION", {
    table: "transactions",
    recordId: result.txId,
    oldValue: { balance: result.oldBalance },
    newValue: { type, amount, balance: result.newBalance },
  });
  return { type, amount, ...result };
};

const baseOptions = ({ accountId, type } = {}) => {
  const where = {};
  if (accountId) where.account_id = accountId;
  if (TX_TYPES.includes(type)) where.type = type;
  return where;
};

export const listTransactions = ({ accountId, type, limit = 200 } = {}) =>
  BankTransaction.findAll({
    where: baseOptions({ accountId, type }),
    include: [{ model: Account, as: "account", attributes: ["AccountNumber"] }],
    order: [["created_at", "DESC"], ["id", "DESC"]],
    limit,
    raw: true,
    nest: true,
  });

// Totals across ALL matching transactions (not just the visible 200).
export const summarize = async ({ type } = {}) => {
  const rows = await BankTransaction.findAll({
    attributes: ["type", [fn("SUM", col("amount")), "total"], [fn("COUNT", col("id")), "count"]],
    where: baseOptions({ type }),
    group: ["type"],
    raw: true,
  });
  const by = Object.fromEntries(rows.map((r) => [r.type, r]));
  const sum = (k) => Number(by[k]?.total ?? 0);
  return {
    deposits: sum("deposit"),
    withdrawals: sum("withdrawal"),
    transfers: sum("transfer"),
    count: rows.reduce((n, r) => n + Number(r.count), 0),
  };
};
