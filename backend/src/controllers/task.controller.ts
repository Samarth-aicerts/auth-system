import { Request, Response } from "express";
import Task from "../models/Task";        

export const createTask = async (
  req: Request,
  res: Response
) => {
  try {

    const workspaceId = req.params.workspaceId as string;

    const {
      title,
      description,
      assignedTo,
      dueDate,
    } = req.body;

    const task = await Task.create({
      title,
      description,
      workspaceId,
      assignedTo,
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

    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
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

    const { taskId } = req.params;

    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({
        message: "Task not found",
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