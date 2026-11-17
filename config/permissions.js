// Who can do what. Same three roles as the PHP version (admin / user / guest),
// but with plain verbs instead of the old API action names.
export const PERMISSIONS = {
  admin: ["view", "create", "edit", "delete", "audit"],
  user: ["view", "create", "edit"],
  guest: ["view"],
};

export const ROLE_INFO = {
  admin: {
    label: "Admin",
    blurb: "Full access: view, add, edit and delete accounts, export data, and review the activity log.",
  },
  user: {
    label: "User",
    blurb: "You can view accounts, open new ones, edit them and record deposits and withdrawals. Only admins can delete.",
  },
  guest: {
    label: "Guest",
    blurb: "View-only access. You can look around, but you can't change anything.",
  },
};

export const can = (role, action) => (PERMISSIONS[role] || []).includes(action);

// { view: true, create: false, ... } — handy for templates: {{#if can.edit}}
export const permissionMap = (role) =>
  Object.fromEntries(["view", "create", "edit", "delete", "audit"].map((a) => [a, can(role, a)]));
