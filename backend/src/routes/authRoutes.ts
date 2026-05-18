import express from "express";

import {
  signup,
  login,
} from "../controllers/authController";

import { protect } from "../middleware/authMiddleware";

const router = express.Router();

router.post("/signup", signup);

router.post("/login", login);

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