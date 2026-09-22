import express, { type Request, type Response } from "express";
export const testingRouter = express.Router();
testingRouter.get("/echo", (req: Request, res: Response) => {
  return res.status(200).json({
    message: "Health check verified",
    success: true,
  });
});
