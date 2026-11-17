import { saveHolder } from "../services/holderService.js";
import { actorFrom } from "../services/auditService.js";

export const save = async (req, res) => {
  await saveHolder(req.params.id, req.body, actorFrom(req));
  req.flash("success_msg", "Account holder details saved.");
  res.redirect(`/accounts/${req.params.id}`);
};
