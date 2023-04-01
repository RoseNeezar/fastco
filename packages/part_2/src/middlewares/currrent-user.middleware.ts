import { NextFunction, Request, Response } from "express";

declare global {
  namespace Express {
    interface Request {
      currentUserIp?: {
        ipAddress?: string | string[];
        timestamp?: Date;
      } | null;
    }
  }
}
export interface UserTokenPayload {
  userId: string;
  tokenVersion: number;
}

export const currentUserIp = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const ipAddress = req.headers["x-forwarded-for"] || req.ip;
  const timestamp = new Date();

  req.currentUserIp = {
    ipAddress,
    timestamp,
  };
  next();
};
