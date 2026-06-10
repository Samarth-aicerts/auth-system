import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";

export const validateObjectId = (
  req: Request,
  res: Response,
  next: NextFunction
) => {

  const ids = Object.values(req.params) as string[];

  for (const id of ids) {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ObjectId",
      });
    }
  }

  next();
};    