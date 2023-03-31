import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      currentUserIp?: string | null;
    }
  }
}
export interface UserTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const currentUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  req.currentUserIp = "ip";

  next();
};
