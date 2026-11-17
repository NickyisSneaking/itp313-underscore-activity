import { Account, AccountHolder } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import { cleanText, parseId } from "../utils/validators.js";
import { logAction } from "./auditService.js";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const saveHolder = async (rawAccountId, input, actor) => {
  const accountId = parseId(rawAccountId);
  const fullName = cleanText(input.full_name).slice(0, 150);
  const emailRaw = cleanText(input.email);
  const email = emailRaw && EMAIL_RE.test(emailRaw) ? emailRaw.slice(0, 100) : null;
  const phone = cleanText(input.phone).replace(/[^0-9+-]/g, "").slice(0, 20) || null;
  const address = cleanText(input.address) || null;

  if (!accountId) throw new AppError("That account link isn't valid.");
  if (!fullName) throw new AppError("Please enter the account holder's full name.");
  if (emailRaw && !email) throw new AppError("That email address doesn't look right. Example: name@example.com");

  const account = await Account.findOne({ attributes: ["id"], where: { id: accountId, is_deleted: false }, raw: true });
  if (!account) throw new AppError("We couldn't find that account. It may have been deleted.", 404);

  const existing = await AccountHolder.findOne({ where: { account_id: accountId } });
  if (existing) await existing.update({ full_name: fullName, email, phone, address });
  else await AccountHolder.create({ account_id: accountId, full_name: fullName, email, phone, address });

  await logAction(actor, "SAVE_HOLDER", { table: "account_holders", recordId: accountId, newValue: { full_name: fullName } });
};
