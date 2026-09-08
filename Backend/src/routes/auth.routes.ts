import express from "express";
import {
  checkLoginController,
  checkOtpController,
  deleteUserController,
  forgotPasswordController,
  getProfileController,
  loginController,
  logOutController,
  registerController,
  updatePasswordByEnterController,
  updatePasswordByOtpController,
  updateProfileController,
} from "../controllers/auth.controller.js";
import { verifyUser } from "../middleware/user.middleware.js";

export const authRouter = express.Router();

authRouter.post("/register", registerController);
authRouter.post("/login", loginController);
authRouter.get("/profile", verifyUser, getProfileController);
authRouter.get("/checklogin", verifyUser, checkLoginController);
authRouter.patch("/updateprofile", verifyUser, updateProfileController);
authRouter.patch(
  "/updatepassword",
  verifyUser,
  updatePasswordByEnterController,
);
authRouter.post("/sendotp", checkOtpController);
authRouter.patch("/forgotpassword", forgotPasswordController);
authRouter.patch("/resetbyotp", verifyUser, updatePasswordByOtpController);
authRouter.delete("/deleteprofile", verifyUser, deleteUserController);
authRouter.delete("/logout", verifyUser, logOutController);
