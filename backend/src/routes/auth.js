import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import { getMe, verifyEmail, sendVerificationEmail } from "../controllers/authController.js";

const router = Router();

router.get("/me", requireAuth, getMe);
router.post("/send-verification-email", sendVerificationEmail);
router.post("/verify-email", verifyEmail);

export default router;
