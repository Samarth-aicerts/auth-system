import express from "express";

import { protect } from "../middleware/authmiddleware";
import isWorkspaceMember from "../middleware/isWorkspaceMember";
import { requireRole } from "../middleware/requireRole";

import { validate } from "../middleware/validate";
import { createTaskSchema } from "../validations/task.validation";

import {
  createTask,
  getTasks,
  updateTask,
  deleteTask
} from "../controllers/task.controller";

const router = express.Router({
  mergeParams: true,
});

router.post(
  "/",
  protect,
  isWorkspaceMember,
  validate(createTaskSchema),
  createTask
);

router.get(
  "/",
  protect,
  isWorkspaceMember,
  getTasks
);

router.patch(
  "/:taskId",
  protect,
  isWorkspaceMember,
  updateTask
);

router.delete(
  "/:taskId",
  protect,
  isWorkspaceMember,
  requireRole(["admin"]),
  deleteTask
);

export default router;    