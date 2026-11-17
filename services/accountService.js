import { hashPassword } from "../utils/password.js";
import { Op, fn, col, literal } from "sequelize";
import { Account, AccountHolder } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import {
  STATUSES, parseId, parseAccountNumber, parseMoney, parseStatus, parsePin, escapeLike,
} from "../utils/validators.js";
import { logAction } from "./auditService.js";

const PUBLIC_FIELDS = ["id", "AccountNumber", "TotalBalance", "status", "created_at", "updated_at"];

export const listAccounts = ({ keyword = "", status = "" } = {}) => {
  const where = { is_deleted: false };
  if (keyword) where.AccountNumber = { [Op.like]: `%${escapeLike(keyword)}%` };
  if (STATUSES.includes(status)) where.status = status;
  return Account.findAll({ attributes: PUBLIC_FIELDS, where, order: [["id", "DESC"]], raw: true });
};

export const getAccount = async (id) => {
  const account = await Account.findOne({
    attributes: PUBLIC_FIELDS,
    where: { id, is_deleted: false },
    raw: true,
  });
  if (!account) throw new AppError("We couldn't find that account. It may have been deleted.", 404);
  return account;
};

export const getStats = async () => {
  const r = await Account.findOne({
    attributes: [
      [fn("MAX", col("TotalBalance")), "max"],
      [fn("MIN", col("TotalBalance")), "min"],
      [fn("AVG", col("TotalBalance")), "avg"],
      [fn("SUM", col("TotalBalance")), "total"],
      [fn("COUNT", col("id")), "count"],
    ],
    where: { is_deleted: false },
    raw: true,
  });
  return {
    max: Number(r.max ?? 0),
    min: Number(r.min ?? 0),
    avg: Number(r.avg ?? 0),
    total: Number(r.total ?? 0),
    count: Number(r.count ?? 0),
  };
};

// Always returns all three statuses (even when empty) so the page layout never jumps around.
export const groupByStatus = async () => {
  const rows = await Account.findAll({
    attributes: ["status", [fn("COUNT", col("id")), "accounts"], [fn("SUM", col("TotalBalance")), "balance"]],
    where: { is_deleted: false },
    group: ["status"],
    raw: true,
  });
  const byStatus = Object.fromEntries(rows.map((r) => [r.status, r]));
  return STATUSES.map((s) => ({
    status: s,
    accounts: Number(byStatus[s]?.accounts ?? 0),
    balance: Number(byStatus[s]?.balance ?? 0),
  }));
};

export const createAccount = async (input, actor) => {
  const rawNumber = String(input.account_number ?? "").trim();
  const accountNumber = rawNumber ? parseAccountNumber(rawNumber) : `ACC${Date.now()}`;
  const pin = parsePin(input.pin);
  const balance = parseMoney(input.balance === "" || input.balance == null ? 0 : input.balance);
  const status = parseStatus(input.status || "active");

  const problems = [];
  if (!accountNumber) problems.push("The account number can only use letters, numbers and dashes (up to 50 characters).");
  if (!pin) problems.push("The PIN must be 4 to 20 characters long.");
  if (balance === null) problems.push("The opening balance must be a number like 500 or 250.75 (not negative).");
  if (!status) problems.push("Please choose a valid status.");
  if (problems.length) throw new AppError(problems.join(" "));

  const duplicate = await Account.count({ where: { AccountNumber: accountNumber, is_deleted: false } });
  if (duplicate) throw new AppError(`An account numbered ${accountNumber} already exists. Please use a different number.`);

  const account = await Account.create({
    AccountNumber: accountNumber,
    PIN: await hashPassword(pin),
    TotalBalance: balance,
    status,
  });

  await logAction(actor, "INSERT", {
    table: "accounts",
    recordId: account.id,
    newValue: { AccountNumber: accountNumber, TotalBalance: balance, status },
  });
  return { id: account.id, AccountNumber: accountNumber };
};

export const updateAccount = async (rawId, input, actor) => {
  const id = parseId(rawId);
  const balance = parseMoney(input.balance);
  const status = parseStatus(input.status);

  const problems = [];
  if (!id) problems.push("That account link isn't valid.");
  if (balance === null) problems.push("The balance must be a number like 500 or 250.75 (not negative).");
  if (!status) problems.push("Please choose a valid status.");
  if (problems.length) throw new AppError(problems.join(" "));

  const old = await Account.findOne({
    attributes: ["TotalBalance", "status", "AccountNumber"],
    where: { id, is_deleted: false },
    raw: true,
  });
  if (!old) throw new AppError("We couldn't find that account. It may have been deleted.", 404);

  await Account.update(
    { TotalBalance: balance, status, updated_at: literal("CURRENT_TIMESTAMP") },
    { where: { id, is_deleted: false } }
  );

  await logAction(actor, "UPDATE", {
    table: "accounts",
    recordId: id,
    oldValue: { TotalBalance: old.TotalBalance, status: old.status },
    newValue: { TotalBalance: balance, status },
  });
  return { AccountNumber: old.AccountNumber };
};

export const softDeleteAccount = async (rawId, actor) => {
  const id = parseId(rawId);
  if (!id) throw new AppError("That account link isn't valid.");

  const old = await Account.findOne({
    attributes: ["AccountNumber", "TotalBalance", "status"],
    where: { id, is_deleted: false },
    raw: true,
  });
  if (!old) throw new AppError("We couldn't find that account. It may already be deleted.", 404);

  await Account.update(
    { is_deleted: true, deleted_at: literal("CURRENT_TIMESTAMP"), updated_at: literal("CURRENT_TIMESTAMP") },
    { where: { id } }
  );
  await logAction(actor, "SOFT_DELETE", { table: "accounts", recordId: id, oldValue: old, newValue: { is_deleted: 1 } });
  return { AccountNumber: old.AccountNumber };
};

export const holderFor = (accountId) => AccountHolder.findOne({ where: { account_id: accountId }, raw: true });
