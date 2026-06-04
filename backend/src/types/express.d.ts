import "express";

declare global {
  namespace Express {
    interface Request {
      user: {
        id: string;
      };
      workspaceRole?: "admin" | "member";
    }
  }
}

export {};