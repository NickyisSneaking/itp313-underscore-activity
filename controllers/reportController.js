import { groupByStatus, getStats } from "../services/accountService.js";

export const summaryPage = async (req, res) => {
  const [groups, stats] = await Promise.all([groupByStatus(), getStats()]);
  const withShare = groups.map((g) => ({
    ...g,
    share: stats.count ? Math.round((g.accounts / stats.count) * 100) : 0,
  }));
  res.render("summary", { title: "Accounts by status", active: "summary", groups: withShare, stats });
};
