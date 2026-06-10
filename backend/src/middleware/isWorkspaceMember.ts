import { Request, Response, NextFunction } from "express";
import Workspace from "../models/Workspace";

const isWorkspaceMember = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);
   
    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    } 

    const member = workspace.members.find(
      (m) => m.userId.toString() === (req as any).user.id
    );

    if (!member) {
      return res.status(403).json({
        message: "You do not belong to this workspace",
      });
    }

    (req as any).workspace = workspace;
    (req as any).workspaceRole = member.role;

    next();
  } catch (error) {
    next(error);
  }
};

export default isWorkspaceMember;
