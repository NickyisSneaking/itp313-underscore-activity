import { recordTransaction, listTransactions, summarize } from "../services/transactionService.js";
import { actorFrom } from "../services/auditService.js";
import { TX_TYPES } from "../utils/validators.js";
import { peso } from "../utils/hbsHelpers.js";
import { TYPE_INFO } from "../utils/labels.js";

export const indexPage = async (req, res) => {
  const type = TX_TYPES.includes(req.query.type) ? req.query.type : "";
  const [transactions, totals] = await Promise.all([listTransactions({ type }), summarize({ type })]);
  res.render("transactions", { title: "Transactions", active: "transactions", transactions, totals, type });
};

export const create = async (req, res) => {
  const r = await recordTransaction(req.params.id, req.body, actorFrom(req));
  req.flash(
    "success_msg",
    `${TYPE_INFO[r.type].label} of ${peso(r.amount)} recorded. New balance: ${peso(r.newBalance)}.`
  );
  res.redirect(`/accounts/${req.params.id}`);
};
