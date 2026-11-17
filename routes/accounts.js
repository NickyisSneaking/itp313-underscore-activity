import express from "express";
import * as accounts from "../controllers/accountController.js";
import * as transactions from "../controllers/transactionController.js";
import * as holders from "../controllers/holderController.js";
import { requireCan } from "../middleware/auth.js";
import { wrap } from "../utils/http.js";

const router = express.Router();
router.param("id", accounts.validateIdParam);

router.get("/", requireCan("view"), wrap(accounts.indexPage));
router.post("/", requireCan("create"), wrap(accounts.create));
router.get("/export", requireCan("audit"), wrap(accounts.exportCsv)); // must come before "/:id"

router.get("/:id", requireCan("view"), wrap(accounts.showPage));
router.post("/:id/update", requireCan("edit"), wrap(accounts.update));
router.post("/:id/delete", requireCan("delete"), wrap(accounts.remove));

router.post("/:id/transactions", requireCan("create"), wrap(transactions.create));
router.post("/:id/holder", requireCan("create"), wrap(holders.save));

export default router;
