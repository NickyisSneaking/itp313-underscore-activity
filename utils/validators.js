import { MAX_MONEY } from "../config/security.js";

export const STATUSES = ["active", "inactive", "suspended"];
export const TX_TYPES = ["deposit", "withdrawal", "transfer"];

// Removes HTML tags and trims — same idea as PHP's trim(strip_tags(...)).
export const cleanText = (v) => String(v ?? "").replace(/<[^>]*>/g, "").trim();

export const parseId = (v) => {
  const n = Number(v);
  return Number.isInteger(n) && n > 0 ? n : null;
};

export const parseAccountNumber = (v) => {
  const s = cleanText(v);
  return /^[A-Za-z0-9-]{1,50}$/.test(s) ? s : null;
};

// Returns a number with 2 decimals, or null when invalid.
export const parseMoney = (v, { allowZero = true } = {}) => {
  const s = String(v ?? "").replace(/,/g, "").trim();
  if (!/^\d+(\.\d{1,2})?$/.test(s)) return null;
  const n = Number(s);
  if (n > MAX_MONEY) return null;
  if (!allowZero && n <= 0) return null;
  return Math.round(n * 100) / 100;
};

export const parseStatus = (v) => {
  const s = cleanText(v).toLowerCase();
  return STATUSES.includes(s) ? s : null;
};

export const parseTxType = (v) => {
  const s = cleanText(v).toLowerCase();
  return TX_TYPES.includes(s) ? s : null;
};

export const parsePin = (v) => {
  const s = String(v ?? "").trim();
  return s.length >= 4 && s.length <= 20 ? s : null;
};

// Money maths in whole cents so 0.1 + 0.2 never goes wrong.
export const toCents = (n) => Math.round(Number(n) * 100);
export const fromCents = (c) => c / 100;

// Escape % and _ so a search for "50%" doesn't act like a wildcard.
export const escapeLike = (s) => String(s).replace(/[\\%_]/g, (m) => "\\" + m);
