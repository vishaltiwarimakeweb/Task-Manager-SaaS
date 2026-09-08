import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { getUserService } from "../services/authServices/authServices.js";
export const verifyUser = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const token = req.cookies.token;
  console.log("Cookies received are : ", req.cookies);
  if (!token) {
    return res.status(401).json({
      message: "Token not found",
      success: false,
    });
  }
  const decode = jwt.verify(token, process.env.JWT_SECRET!) as any;
  const userId = decode.userId;
  if (!userId) {
    return res.status(401).json({
      message: "Unauthorized, please login",
      success: false,
    });
  }
  const user = await getUserService(userId);
  if (!user) {
    return res.status(401).json({
      message: "Account not found",
      success: false,
    });
  }
  (req as any).userId = userId;
  return next();
};
