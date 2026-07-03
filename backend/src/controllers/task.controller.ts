import Workspace from "../models/Workspace";
import { Request, Response } from "express";
import Task from "../models/Task";
import User from "../models/User";
import { checkCircularDependency } from "../utils/checkCircularDependency";

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {

    const workspaceId = req.params.workspaceId as string;

    // Check if the workspace exists

    const workspace =
      await Workspace.findById(workspaceId);  

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const {
      title,
      description,
      assignedTo,
      dependencies,
      dueDate,
    } = req.body;

    if (dependencies?.length) {

      const dependencyTasks =
        await Task.find({
          _id: {
            $in: dependencies,
          },
        });

      const invalidTask =
        dependencyTasks.find(
          (task) =>
            task.workspaceId.toString() !==
            workspaceId
        );

      if (invalidTask) {
        return res.status(400).json({
          message:
            "Dependencies must belong to same workspace",
        });
      }

    }

    // check if assigned user is exist

    if (assignedTo) {

      const user = await User.findById(
        assignedTo
      );

      if (!user) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
      // check if assigned user is a member of the workspace
      const member =
        workspace.members.find(
          (member: any) =>
            member.userId.toString() ===
            assignedTo
        );

      if (!member) {
        return res.status(400).json({
          message:
            "User is not a member of this workspace",
        });
      }

    }

    const task = await Task.create({
      title,
      description,
      workspaceId,
      assignedTo,
      dependencies,
      dueDate,
    });

    res.status(201).json({
      success: true,
      message: "Task created successfully",
      task,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};

export const getTasks = async (
  req: Request,
  res: Response
) => {
  try {

    const { workspaceId } = req.params;

    const workspace =
      await Workspace.findById(workspaceId);

    if (!workspace) {
      return res.status(404).json({
        message: "Workspace not found",
      });
    }

    const {
      page = "1",
      limit = "10",
      status,
    } = req.query;

    const query: any = {
      workspaceId,
    };

    if (status) {
      query.status = status;
    }

    const tasks = await Task.find(query)
      .populate("assignedTo", "email")
      .skip(
        (Number(page) - 1) * Number(limit)
      )
      .limit(Number(limit));

    const totalTasks =
      await Task.countDocuments(query);

    res.status(200).json({
      success: true,
      totalTasks,
      page: Number(page),
      limit: Number(limit),
      tasks,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};

export const updateTask = async (
  req: Request,
  res: Response
) => {
  try {

    const { taskId, workspaceId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.workspaceId.toString() !==
      workspaceId
    ) {
      return res.status(403).json({
        message:
          "Task does not belong to this workspace",
      });
    }

    const userId = (req as any).user.id;

    if (
      (req as any).workspaceRole !== "admin" &&
      task.assignedTo?.toString() !== userId
    ) {
      return res.status(403).json({
        message:
          "You can only update tasks assigned to you",
      });
    }
    // prevents assigning tasks to invalid users during updates.
    if (req.body.assignedTo) {

      const user = await User.findById(
        req.body.assignedTo
      );

      if (!user) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }

    }

    const workspace =
      await Workspace.findById(workspaceId);

    const member =
      workspace?.members.find(
        (member: any) =>
          member.userId.toString() ===
          req.body.assignedTo
      );

    if (
      req.body.assignedTo &&
      !member
    ) {
      return res.status(400).json({
        message:
          "User is not a member of this workspace",
      });
    }

    //Cross-Workspace Validation

    if (req.body.dependencies?.length) {

      const dependencyTasks =
        await Task.find({
          _id: {
            $in: req.body.dependencies,
          },
        });

      const invalidTask =
        dependencyTasks.find(
          (task) =>
            task.workspaceId.toString() !==
            workspaceId
        );

      if (invalidTask) {
        return res.status(400).json({
          message:
            "Dependencies must belong to same workspace",
        });
      }

    }

    // Circular Dependency Validation

    if (req.body.dependencies?.length) {

      for (const dependency of req.body.dependencies) {

        const hasCycle =
          await checkCircularDependency(
            Array.isArray(taskId) ? taskId[0] : taskId,
            typeof dependency === 'string' ? dependency : dependency
          );

        if (hasCycle) {
          return res.status(400).json({
            message:
              "Circular dependency detected",
          });
        }

      }

    }

    // Status Lock Validation

    if (
      req.body.status === "in-progress" ||
      req.body.status === "done"
    ) {
      const dependencyTasks = await Task.find({
        _id: {
          $in: task.dependencies,
        },
      });

      const pendingTask =
        dependencyTasks.find(
          (dependencyTask) =>
            dependencyTask.status !== "done"
        );

      if (pendingTask) {
        return res.status(400).json({
          message:
            "Cannot update status: Parent tasks are not completed yet",
        });
      }
    }

    Object.assign(task, req.body);

    await task.save();

    res.status(200).json({
      success: true,
      message: "Task updated successfully",
      task,
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};

export const deleteTask = async (
  req: Request,
  res: Response
) => {
  try {

    const { taskId, workspaceId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
      });
    }

    if (
      task.workspaceId.toString() !==
      workspaceId
    ) {
      return res.status(403).json({
        message:
          "Task does not belong to this workspace",
      });
    }


      
    await Task.findByIdAndDelete(taskId);

    res.status(200).json({
      success: true,
      message: "Task deleted successfully",
    });

  } catch (error) {

    res.status(500).json({
      message: "Server Error",
      error,
    });

  }
};