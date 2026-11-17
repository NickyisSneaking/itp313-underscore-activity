import {
  listAccounts, getAccount, createAccount, updateAccount, softDeleteAccount, holderFor,
} from "../services/accountService.js";
import { listTransactions } from "../services/transactionService.js";
import { actorFrom, logAction } from "../services/auditService.js";
import { cleanText, STATUSES, parseId } from "../utils/validators.js";
import { csvCell } from "../utils/http.js";
import { AppError } from "../utils/errors.js";

export const indexPage = async (req, res) => {
  const keyword = cleanText(req.query.keyword).slice(0, 50);
  const status = STATUSES.includes(req.query.status) ? req.query.status : "";
  const accounts = await listAccounts({ keyword, status });
  res.render("accounts", {
    title: "Accounts",
    active: "accounts",
    accounts,
    count: accounts.length,
    keyword,
    status,
    filtered: Boolean(keyword || status),
  });
};

export const showPage = async (req, res) => {
  const id = parseId(req.params.id);
  const account = await getAccount(id);
  const [transactions, holder] = await Promise.all([
    listTransactions({ accountId: id, limit: 100 }),
    // Personal details are only shown to people who can manage accounts (not guests)
    res.locals.can.create ? holderFor(id) : null,
  ]);
  res.render("account", { title: account.AccountNumber, active: "accounts", account, transactions, holder: holder || {} });
};

export const create = async (req, res) => {
  const { AccountNumber } = await createAccount(req.body, actorFrom(req));
  req.flash("success_msg", `Account ${AccountNumber} was created.`);
  res.redirect("/accounts");
};

export const update = async (req, res) => {
  const { AccountNumber } = await updateAccount(req.params.id, req.body, actorFrom(req));
  req.flash("success_msg", `Account ${AccountNumber} was updated.`);
  res.redirect(req.body.return_to === "detail" ? `/accounts/${req.params.id}` : "/accounts");
};

export const remove = async (req, res) => {
  const { AccountNumber } = await softDeleteAccount(req.params.id, actorFrom(req));
  req.flash("success_msg", `Account ${AccountNumber} was deleted. It's hidden from the lists but kept in the database.`);
  res.redirect("/accounts");
};

export const exportCsv = async (req, res) => {
  const status = STATUSES.includes(req.query.status) ? req.query.status : "";
  const rows = await listAccounts({ status });
  const lines = [["ID", "Account Number", "Balance", "Status", "Created At"].join(",")];
  for (const r of rows) {
    lines.push([r.id, r.AccountNumber, r.TotalBalance, r.status, r.created_at].map(csvCell).join(","));
  }
  await logAction(actorFrom(req), "EXPORT_CSV", { table: "accounts" });
  res.set({
    "Content-Type": "text/csv; charset=utf-8",
    "Content-Disposition": "attachment; filename=accounts_export.csv",
  });
  res.send("\uFEFF" + lines.join("\r\n")); // BOM so Excel shows ₱/accents correctly
};

// Make `:id` in the URL safe before any handler sees it
export const validateIdParam = (req, res, next, value) => {
  if (!parseId(value)) return next(new AppError("That account link isn't valid.", 404));
  next();
};
