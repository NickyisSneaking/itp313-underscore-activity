import { recentActivity } from "../services/auditService.js";
import { listLoginAttempts } from "../services/authService.js";
import { actionInfo } from "../utils/labels.js";

const parse = (text) => {
  if (!text) return null;
  try {
    const v = JSON.parse(text);
    return v && typeof v === "object" ? v : { value: String(v) };
  } catch {
    return { value: String(text) };
  }
};

// Before/after objects → [{ key, before, after }] so the page can show a tidy comparison.
const changes = (oldText, newText) => {
  const before = parse(oldText) || {};
  const after = parse(newText) || {};
  return [...new Set([...Object.keys(before), ...Object.keys(after)])].map((key) => ({
    key,
    before: before[key] ?? "—",
    after: after[key] ?? "—",
  }));
};

export const auditPage = async (req, res) => {
  const rows = await recentActivity(100);
  const entries = rows.map((r) => {
    const info = actionInfo(r.action);
    const diff = changes(r.old_value, r.new_value);
    return { ...r, label: info.label, icon: info.icon, cls: info.cls, role: r.user?.role || null, diff, hasDiff: diff.length > 0 };
  });
  res.render("audit", { title: "Activity log", active: "audit", entries });
};

export const securityPage = async (req, res) => {
  const attempts = await listLoginAttempts(100);
  const failed = attempts.filter((a) => !Number(a.success)).length;
  res.render("security", {
    title: "Sign-in security",
    active: "security",
    attempts: attempts.map((a) => ({ ...a, ok: Boolean(Number(a.success)) })),
    failed,
    succeeded: attempts.length - failed,
  });
};
