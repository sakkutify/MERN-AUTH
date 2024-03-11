import express from "express"
import {
  signupController,
  signinController,
  signoutController,
  forgotPasswordController,
  resetPasswordValidatorController,
  resetPasswordController,
  checkAuthController,
} from "../controllers/authController.js"

const router = express.Router()

router.get("/check-auth", checkAuthController)
router.post("/signup", signupController)
router.post("/signin", signinController)
router.post("/signout", signoutController)
router.post("/forgot-password", forgotPasswordController)
router.get("/reset-password/:userId/:token", resetPasswordValidatorController)
router.post("/reset-password/:userId/:token", resetPasswordController)

export default router
