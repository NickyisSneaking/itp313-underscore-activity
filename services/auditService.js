import { AuditTrail, User } from "../models/index.js";
import { normalizeIp } from "../utils/http.js";

// Who is doing this? Built from the signed-in session.
export const actorFrom = (req) => ({
  id: req.session?.user?.id ?? null,
  username: req.session?.user?.username ?? "anonymous",
  ip: normalizeIp(req.ip),
});

const asText = (v) => (v === null || v === undefined ? null : typeof v === "object" ? JSON.stringify(v) : String(v));

// Never lets a logging problem break the action the person just completed.
export const logAction = async (actor, action, { table = "", recordId = null, oldValue = null, newValue = null } = {}) => {
  try {
    await AuditTrail.create({
      user_id: actor.id,
      username: actor.username,
      action: String(action).toUpperCase(),
      table_name: table,
      record_id: recordId,
      old_value: asText(oldValue),
      new_value: asText(newValue),
      ip_address: actor.ip,
    });
  } catch (err) {
    console.error("⚠️  Could not write audit entry:", err.message);
  }
};

export const recentActivity = (limit = 100) =>
  AuditTrail.findAll({
    include: [{ model: User, as: "user", attributes: ["role"] }],
    order: [["created_at", "DESC"], ["id", "DESC"]],
    limit,
    raw: true,
    nest: true,
  });
