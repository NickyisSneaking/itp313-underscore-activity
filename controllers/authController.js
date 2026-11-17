import { authenticate } from "../services/authService.js";
import { actorFrom, logAction } from "../services/auditService.js";
import { normalizeIp } from "../utils/http.js";

export const loginPage = (req, res) => {
  res.render("login", {
    title: "Sign in",
    info: req.query.msg === "signedout" ? "You've been signed out safely." : null,
    username: "",
  });
};

export const loginUser = async (req, res) => {
  const { username, password } = req.body;
  const result = await authenticate(username, password, normalizeIp(req.ip));

  if (result.error) {
    res.status(401);
    return res.render("login", { title: "Sign in", error: result.error, username: String(username ?? "").slice(0, 100) });
  }

  // New session id on sign-in (prevents session fixation)
  await new Promise((resolve, reject) => req.session.regenerate((e) => (e ? reject(e) : resolve())));
  req.session.user = result.user;
  await logAction({ id: result.user.id, username: result.user.username, ip: normalizeIp(req.ip) }, "LOGIN");
  await new Promise((resolve) => req.session.save(resolve));
  res.redirect("/dashboard");
};

export const logoutUser = async (req, res) => {
  if (req.session?.user) await logAction(actorFrom(req), "LOGOUT");
  await new Promise((resolve) => req.session.destroy(resolve));
  res.redirect("/login?msg=signedout");
};
