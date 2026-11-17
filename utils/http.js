// Small helpers shared by controllers.

// Lets controllers be async without try/catch everywhere — errors go to the error handler.
export const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

// Where to send the person back to after a failed form. Only same-site paths are allowed.
export const safeBack = (req, fallback = "/dashboard") => {
  const ref = req.get("Referer");
  if (!ref) return fallback;
  try {
    const u = new URL(ref);
    if (u.host !== req.get("Host")) return fallback;
    return u.pathname + u.search;
  } catch {
    return fallback;
  }
};

export const normalizeIp = (ip) => {
  if (!ip) return "unknown";
  if (ip === "::1") return "127.0.0.1";
  return ip.replace(/^::ffff:/, "");
};

export const csvCell = (v) => {
  const s = String(v ?? "");
  return /[",\n\r]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
};
