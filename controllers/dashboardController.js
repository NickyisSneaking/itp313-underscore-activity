import { getStats, groupByStatus } from "../services/accountService.js";
import { listTransactions } from "../services/transactionService.js";

export const overviewPage = async (req, res) => {
  const [stats, groups, recent] = await Promise.all([
    getStats(),
    groupByStatus(),
    listTransactions({ limit: 5 }),
  ]);
  res.render("dashboard", { title: "Overview", active: "dashboard", stats, groups, recent });
};
