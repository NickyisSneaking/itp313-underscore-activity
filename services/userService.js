import { verifyPassword, hashPassword } from "../utils/password.js";
import { User } from "../models/index.js";
import { AppError } from "../utils/errors.js";
import { logAction } from "./auditService.js";

export const changePassword = async (userId, { old_password, new_password, confirm_password }, actor) => {
  if (!old_password || !new_password) throw new AppError("Please fill in all three password boxes.");
  if (String(new_password).length < 6) throw new AppError("Your new password needs at least 6 characters.");
  if (new_password !== confirm_password) throw new AppError("The new password and the confirmation don't match.");

  const user = await User.findByPk(userId);
  if (!user || !(await verifyPassword(old_password, user.password))) {
    throw new AppError("Your current password isn't correct.");
  }
  if (await verifyPassword(new_password, user.password)) {
    throw new AppError("Your new password must be different from the current one.");
  }

  await user.update({ password: await hashPassword(new_password) });
  await logAction(actor, "CHANGE_PASSWORD", { table: "users", recordId: userId });
};
