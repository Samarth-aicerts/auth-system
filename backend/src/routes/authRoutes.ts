import express from "express";

import {
  signup,
  login,
  verifyOtp,
} from "../controllers/authController";

import { protect } from "../middleware/authmiddleware";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

router.post("/verify-otp", verifyOtp);

router.get(
  "/profile",
  protect,
  (req, res) => {
    res.json({
      message:
        "Protected Route Accessed",
    });
  }
);

export default router;