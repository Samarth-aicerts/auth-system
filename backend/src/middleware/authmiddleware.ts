import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const protect = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {

  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      message: "No Token",
    }); 

    return;
  }

  const token = authHeader.split(" ")[1];

  try {

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET as string
    );

    (req as any).user = decoded;

    next();

  } catch (error) {

    res.status(401).json({
      message: "Invalid Token",
      error,
    });

    return;
  }
};