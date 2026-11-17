import { changePassword } from "../services/userService.js";
import { actorFrom } from "../services/auditService.js";

export const profilePage = (req, res) => res.render("profile", { title: "My profile", active: "profile" });

export const updatePassword = async (req, res) => {
  await changePassword(req.session.user.id, req.body, actorFrom(req));
  req.flash("success_msg", "Your password was changed.");
  res.redirect("/profile");
};
