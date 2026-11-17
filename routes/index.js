import express from "express";
import authRoutes from "./auth.js";
import accountRoutes from "./accounts.js";
import { requireLogin, requireCan } from "../middleware/auth.js";
import { wrap } from "../utils/http.js";
import { overviewPage } from "../controllers/dashboardController.js";
import { indexPage as transactionsPage } from "../controllers/transactionController.js";
import { summaryPage } from "../controllers/reportController.js";
import { auditPage, securityPage } from "../controllers/activityController.js";
import { profilePage, updatePassword } from "../controllers/profileController.js";

const router = express.Router();

router.get("/", (req, res) => res.redirect(req.session?.user ? "/dashboard" : "/login"));

// Public: sign in / out
router.use(authRoutes);

// Everything below needs a signed-in user
router.use(requireLogin);

router.get("/dashboard", requireCan("view"), wrap(overviewPage));
router.use("/accounts", accountRoutes);
router.get("/transactions", requireCan("view"), wrap(transactionsPage));
router.get("/summary", requireCan("view"), wrap(summaryPage));

router.get("/audit", requireCan("audit"), wrap(auditPage));
router.get("/security", requireCan("audit"), wrap(securityPage));

router.get("/profile", profilePage);
router.post("/profile/password", wrap(updatePassword));

export default router;
