import { can, permissionMap, ROLE_INFO } from "../config/permissions.js";

// Makes the signed-in user and their permissions available to every page template.
export const attachUser = (req, res, next) => {
  const user = req.session?.user || null;
  res.locals.currentUser = user;
  res.locals.can = permissionMap(user?.role);
  res.locals.roleInfo = user ? ROLE_INFO[user.role] || ROLE_INFO.guest : null;
  next();
};

export const requireLogin = (req, res, next) => {
  if (req.session?.user) return next();
  req.flash("error_msg", "Please sign in to continue.");
  res.redirect("/login");
};

export const redirectIfSignedIn = (req, res, next) => {
  if (req.session?.user) return res.redirect("/dashboard");
  next();
};

// Usage: router.post("/", requireCan("create"), handler)
export const requireCan = (action) => (req, res, next) => {
  if (can(req.session?.user?.role, action)) return next();
  res.status(403).render("error", {
    title: "Not allowed",
    code: 403,
    heading: "You don't have access to this",
    message: `Your role (${req.session?.user?.role}) can't do that. Ask an administrator if you think you should be able to.`,
  });
};
