import { STATUS_INFO, TYPE_INFO } from "./labels.js";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const num = (v) => {
  const n = Number(v);
  return Number.isFinite(n) ? n : 0;
};

export const peso = (v) =>
  "₱" + num(v).toLocaleString("en-PH", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

// "2026-05-08 11:05:24" → "May 8, 2026 · 11:05 AM"  (no timezone conversion on purpose)
export const fmtDate = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})[ T](\d{2}):(\d{2})/.exec(String(s ?? ""));
  if (!m) return s ? String(s) : "—";
  let h = Number(m[4]);
  const ampm = h >= 12 ? "PM" : "AM";
  h = h % 12 || 12;
  return `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]} · ${h}:${m[5]} ${ampm}`;
};

export const fmtDay = (s) => {
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(String(s ?? ""));
  return m ? `${MONTHS[Number(m[2]) - 1]} ${Number(m[3])}, ${m[1]}` : "—";
};

export function registerHelpers(hbs) {
  hbs.registerHelper("eq", (a, b) => a === b);
  hbs.registerHelper("peso", peso);
  hbs.registerHelper("fmtDate", fmtDate);
  hbs.registerHelper("fmtDay", fmtDay);
  hbs.registerHelper("initial", (s) => String(s ?? "?").charAt(0).toUpperCase());
  hbs.registerHelper("plural", (n, one, many) => (Number(n) === 1 ? one : many));
  hbs.registerHelper("selected", (a, b) => (a === b ? "selected" : ""));

  hbs.registerHelper("statusLabel", (s) => STATUS_INFO[s]?.label ?? s);
  hbs.registerHelper("statusIcon", (s) => STATUS_INFO[s]?.icon ?? "•");
  hbs.registerHelper("statusClass", (s) => STATUS_INFO[s]?.cls ?? "bg-slate-100 text-slate-700 ring-slate-200");

  hbs.registerHelper("typeLabel", (t) => TYPE_INFO[t]?.label ?? t);
  hbs.registerHelper("typeIcon", (t) => TYPE_INFO[t]?.icon ?? "•");
  hbs.registerHelper("typeClass", (t) => TYPE_INFO[t]?.cls ?? "bg-slate-100 text-slate-700 ring-slate-200");
  hbs.registerHelper("typeSign", (t) => TYPE_INFO[t]?.sign ?? "");
  hbs.registerHelper("typeAmountClass", (t) => TYPE_INFO[t]?.amountCls ?? "text-slate-700");

  // Sidebar link styling: highlighted when it is the current page.
  hbs.registerHelper("navClass", (active, key) =>
    active === key
      ? "bg-white/15 text-white"
      : "text-blue-100 hover:bg-white/10 hover:text-white"
  );
}
