import express from "express";
import { loginPage, loginUser, logoutUser } from "../controllers/authController.js";
import { redirectIfSignedIn, requireLogin } from "../middleware/auth.js";
import { wrap } from "../utils/http.js";

const router = express.Router();
router.get("/login", redirectIfSignedIn, loginPage);
router.post("/login", redirectIfSignedIn, wrap(loginUser));
router.post("/logout", requireLogin, wrap(logoutUser));
export default router;
