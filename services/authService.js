import { verifyPassword } from "../utils/password.js";
import { literal } from "sequelize";
import { User, LoginAttempt } from "../models/index.js";
import { MAX_LOGIN_ATTEMPTS, LOCKOUT_MINUTES } from "../config/security.js";
import { cleanText } from "../utils/validators.js";

const recordAttempt = (username, ip, success) =>
  LoginAttempt.create({ username: username.slice(0, 100), ip_address: ip, success });

// Returns { user } on success or { error } with a message that is safe to show.
// The lock times are checked inside MySQL (NOW()) so server/database clocks can never disagree.
export const authenticate = async (rawUsername, password, ip) => {
  const username = cleanText(rawUsername);
  if (!username || !password) return { error: "Please enter both your username and password." };

  const user = await User.findOne({
    where: { username },
    attributes: {
      include: [
        [literal("(is_locked = 1 AND locked_until IS NOT NULL AND locked_until > NOW())"), "locked_now"],
        [literal("CEIL(TIMESTAMPDIFF(SECOND, NOW(), locked_until) / 60)"), "minutes_left"],
      ],
    },
  });

  if (!user) {
    await recordAttempt(username, ip, false);
    return { error: "Invalid username or password." };
  }

  if (Number(user.get("locked_now")) === 1) {
    const mins = Math.max(1, Number(user.get("minutes_left")) || 1);
    return { error: `This account is temporarily locked. Please try again in ${mins} minute${mins === 1 ? "" : "s"}.` };
  }

  // An old lock that has run out starts the count fresh.
  if (user.is_locked) {
    await user.update({ failed_attempts: 0, is_locked: false, locked_until: null });
  }

  const ok = await verifyPassword(password, user.password);
  if (!ok) {
    const attempts = (user.failed_attempts || 0) + 1;
    await recordAttempt(username, ip, false);

    if (attempts >= MAX_LOGIN_ATTEMPTS) {
      await user.update({
        failed_attempts: attempts,
        is_locked: true,
        locked_until: literal(`DATE_ADD(NOW(), INTERVAL ${Number(LOCKOUT_MINUTES)} MINUTE)`),
      });
      return { error: `Too many wrong passwords. This account is locked for ${LOCKOUT_MINUTES} minutes.` };
    }

    await user.update({ failed_attempts: attempts });
    const left = MAX_LOGIN_ATTEMPTS - attempts;
    return { error: `Wrong password. You have ${left} ${left === 1 ? "try" : "tries"} left before this account is locked.` };
  }

  await user.update({ failed_attempts: 0, is_locked: false, locked_until: null });
  await recordAttempt(username, ip, true);
  return { user: { id: user.id, username: user.username, role: user.role } };
};

export const listLoginAttempts = (limit = 100) =>
  LoginAttempt.findAll({ order: [["attempted_at", "DESC"], ["id", "DESC"]], limit, raw: true });
