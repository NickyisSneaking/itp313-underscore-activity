// Friendly wording for things stored as codes in the database.
export const STATUS_INFO = {
  active: { label: "Active", icon: "✔", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200", help: "Working normally." },
  inactive: { label: "Inactive", icon: "⏸", cls: "bg-slate-100 text-slate-700 ring-slate-300", help: "Not currently in use." },
  suspended: { label: "Suspended", icon: "⛔", cls: "bg-amber-100 text-amber-900 ring-amber-300", help: "Temporarily blocked." },
};

export const TYPE_INFO = {
  deposit: { label: "Deposit", short: "Money in", icon: "⬇", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200", sign: "+", amountCls: "text-emerald-700" },
  withdrawal: { label: "Withdrawal", short: "Money out", icon: "⬆", cls: "bg-red-100 text-red-800 ring-red-200", sign: "−", amountCls: "text-red-700" },
  transfer: { label: "Transfer out", short: "Sent elsewhere", icon: "↗", cls: "bg-blue-100 text-blue-800 ring-blue-200", sign: "−", amountCls: "text-blue-700" },
};

export const ACTION_INFO = {
  LOGIN: { label: "Signed in", icon: "🔓", cls: "bg-sky-100 text-sky-800 ring-sky-200" },
  LOGOUT: { label: "Signed out", icon: "🚪", cls: "bg-violet-100 text-violet-800 ring-violet-200" },
  INSERT: { label: "Created an account", icon: "➕", cls: "bg-emerald-100 text-emerald-800 ring-emerald-200" },
  UPDATE: { label: "Edited an account", icon: "✏️", cls: "bg-blue-100 text-blue-800 ring-blue-200" },
  SOFT_DELETE: { label: "Deleted an account", icon: "🗑", cls: "bg-rose-100 text-rose-800 ring-rose-200" },
  TRANSACTION: { label: "Recorded a transaction", icon: "💸", cls: "bg-teal-100 text-teal-800 ring-teal-200" },
  SAVE_HOLDER: { label: "Saved holder details", icon: "👤", cls: "bg-amber-100 text-amber-900 ring-amber-200" },
  CHANGE_PASSWORD: { label: "Changed a password", icon: "🔑", cls: "bg-indigo-100 text-indigo-800 ring-indigo-200" },
  EXPORT_CSV: { label: "Exported accounts to CSV", icon: "⬇️", cls: "bg-orange-100 text-orange-800 ring-orange-200" },
};

export const actionInfo = (a) =>
  ACTION_INFO[a] || { label: String(a || "").replace(/_/g, " ").toLowerCase(), icon: "•", cls: "bg-slate-100 text-slate-700 ring-slate-200" };
