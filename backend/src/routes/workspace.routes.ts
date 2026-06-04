import express from "express";
import isWorkspaceMember  from "../middleware/isWorkspaceMember";
import { requireRole } from "../middleware/requireRole";
import taskRoutes from "./task.routes";
          
import {
    createWorkspace,
    getWorkspaces,
    addMember,
    deleteWorkspace
} from "../controllers/workspace.controller";

import { protect } from "../middleware/authmiddleware";
const router = express.Router();

router.post(
    "/",
    protect,
    createWorkspace
);

router.get(
  "/",
  protect,
  getWorkspaces
);

router.post(
  "/:workspaceId/members",
  protect,
  isWorkspaceMember,
  requireRole(["admin"]),
  addMember,
  
);

router.delete(
  "/:workspaceId",
  protect,
  isWorkspaceMember,
  requireRole(["admin"]),
  deleteWorkspace
);

router.use(
  "/:workspaceId/tasks",
  taskRoutes
);

export default router;