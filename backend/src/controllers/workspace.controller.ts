import { Request, Response, NextFunction } from "express";

import Workspace from "../models/Workspace";

import { createWorkspaceSchema } from "../validations/workspace.validation";

import Task from "../models/Task";

export const createWorkspace = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const validatedData =
      createWorkspaceSchema.parse(req.body);

    const workspace = await Workspace.create({
      name: validatedData.name,

      ownerId: (req as any).user.id,

      members: [
        {
          userId: (req as any).user.id,
          role: "admin",
        },
      ],
    });

    return res.status(201).json({
      message: "Workspace created successfully",
      workspace,
    });   

  } catch (error) {
    next(error);
  }
};

export const getWorkspaces = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const workspaces = await Workspace.find({
      "members.userId": (req as any).user.id,
    });

    return res.status(200).json({
      workspaces,
    });

  } catch (error) {
    next(error);
  }
};

export const addMember = async (
  req: Request,
  res: Response
) => {

  try {

    const { workspaceId } = req.params;

    const { userId, role } = req.body;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {

      res.status(404).json({
        message: "Workspace not found",
      });

      return;
    }

    const existingMember = workspace.members.find(
  (member) => member.userId.toString() === userId
);

if (existingMember) {
  return res.status(400).json({
    message: "User is already a member of this workspace",
  });
}

    workspace.members.push({
      userId,
      role,
    });

    await workspace.save();

    res.status(200).json({
      success: true,
      message: "Member added successfully",
      workspace,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};  

export const deleteWorkspace = async (
  req: Request,
  res: Response
) => {
  try {

    const { workspaceId } = req.params;

    const workspace = await Workspace.findById(workspaceId);

    if (!workspace) {
      res.status(404).json({
        message: "Workspace not found",
      });

      return;
    }

    await Task.deleteMany({
      workspaceId,
    });

    await Workspace.findByIdAndDelete(
      workspaceId
    );

    res.status(200).json({
      success: true,
      message: "Workspace deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};  