  import { Request, Response, NextFunction } from "express";                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      

  export const requireRole = (roles: string[]) => {
    return (
      req: Request,
      res: Response,
      next: NextFunction      
    ) => {

      const workspace = (req as any).workspace;

      const userId = (req as any).user.id;

      const member = workspace.members.find(
        (m: any) => m.userId.toString() === userId
      );

    if (!member) {
      return res.status(403).json({
        message: "Member not found",
      });
    }

    if (!roles.includes(member.role)) {
      return res.status(403).json({
        message: "Access denied",
      });
    }

    next();
  };
};