import type { Request, Response } from "express";
import mongoose, { type ObjectIdQueryTypeCasting } from "mongoose";
import {
  deleteUserService,
  getFullUserService,
  getUserByEmailService,
  getUserService,
  registerUserService,
  updatePasswordService,
  updateUserService,
} from "../services/authServices/authServices.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import redis from "../config/redis.js";
import {
  generateOTP,
  sendPasswordResetEmail,
} from "../utils/mailer.utilities.js";

export const registerController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { name, email, password, avatar } = body;
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email & password all are required",
        success: false,
      });
    }
    const actualName = String(name).trim();
    const actualEmail = String(email).trim();
    const actualPassword = String(password).trim();
    if (actualName.length < 2) {
      return res.status(400).json({
        message: "Name must be atleast 2 characters long",
        success: false,
      });
    }
    if (actualPassword.trim().length < 8) {
      return res.status(400).json({
        message: "Passwor must be atleast 8 characters long",
        success: false,
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(actualPassword, salt);
    const newUser = await registerUserService({
      email: actualEmail,
      password: hashedPassword,
      name: actualName,
      avatar,
    });
    const sendUser = await getUserService(newUser._id as any);
    return res.status(201).json({
      message: "Account created successfully",
      success: true,
      user: sendUser,
    });
  } catch (error) {
    console.log(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const loginController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { email, password } = body;
    if (!email || !password) {
      return res.status(400).json({
        message: "Name, email & password all are required",
        success: false,
      });
    }
    const actualEmail = String(email).trim();
    const actualPassword = String(password).trim();
    const user = await getUserByEmailService(actualEmail);
    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
        success: false,
      });
    }
    const matchPassword = await bcrypt.compare(actualPassword, user?.password);
    if (!matchPassword) {
      return res.status(401).json({
        message: "Incorrect email or password",
        success: false,
      });
    }
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET!, {
      expiresIn: 7 * 24 * 60 * 60 * 1000,
    });
    const sendUser = await getUserService(user._id);
    // res.cookie("token", token, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    //   path: "/",
    // });
    await redis.set(`userSession:${user._id}`, JSON.stringify(true));
    return res.status(200).json({
      message: "Logged in successfully",
      success: true,
      user: sendUser,
      token,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const checkLoginController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(404).json({
        message: "User ID not found",
        success: false,
      });
    }
    const status = await redis.get(`userSession:${userId}`);
    if (!status) {
      return res.status(401).json({
        message: "Not logged in",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Logged in",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const logOutController = async (req: Request | any, res: Response) => {
  try {
    const userId = req.userId;
    res.clearCookie("token");
    await redis.del(`userSession:${userId}`);
    return res.status(200).json({
      message: "Logged out successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal server Error",
      succes: false,
    });
  }
};

export const getProfileController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const user = await getUserService(userId as ObjectIdQueryTypeCasting);

    if (!user) {
      return res.status(404).json({
        message: "Profile not found",
        success: false,
      });
    }

    return res.status(200).json({
      message: "Profile found successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updateProfileController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const body = req.body;
    const { name, avatar, email } = body;
    const actualName = String(name).trim();
    const actualEmail = String(email).trim();
    const updateData: any = {};
    if (email) {
      const accRegistered = await getUserByEmailService(actualEmail);
      if (accRegistered) {
        return res.status(401).json({
          message: "Email already registered",
          success: false,
        });
      } else updateData.email = actualEmail;
    }
    if (name && actualName.length < 2) {
      return res.status(400).json({
        message: "Name must be atleast 2 characters long",
        success: false,
      });
    }
    if (name) updateData.name = actualName;
    if (avatar) updateData.avatar = avatar;
    await updateUserService(userId as ObjectIdQueryTypeCasting, updateData);
    const user = await getUserService(userId);
    return res.status(200).json({
      message: "Account updated successfully",
      success: true,
      user,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
export const deleteUserController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const userId = req.userId;
    const deletedUser = await deleteUserService(userId);
    if (!deletedUser) {
      return res.status(404).json({
        message: "Account not found or already deleted",
        success: false,
      });
    }
    return res.status(200).json({
      message: "Account deleted successfully",
      success: true,
      user: deletedUser,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updatePasswordByEnterController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const body = req.body;
    const { currPassword, newPassword } = body;
    if (!currPassword || !newPassword) {
      return res.status(400).json({
        message: "Current password and new password both are required",
        success: false,
      });
    }
    const actualPassword = String(newPassword).trim();
    if (actualPassword.length < 8) {
      return res.status(400).json({
        message: "New password must be atleast 8 characters long",
        success: false,
      });
    }
    const comparePassword = String(currPassword).trim();
    const user = await getFullUserService(
      req.userId as ObjectIdQueryTypeCasting,
    );
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    const matchPassword = await bcrypt.compare(comparePassword, user.password);
    if (!matchPassword) {
      return res.status(401).json({
        message: "Incorrect password, please try again",
        success: false,
      });
    }
    await updatePasswordService(req.userId, actualPassword);
    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const checkOtpController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { email } = body;
    if (!email) {
      return res.status(400).json({
        message: "Email is required to send OTP",
        success: false,
      });
    }
    const emailRegex = /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        message: "Invalid email, please enter a valid email",
        success: false,
      });
    }
    const user = await getUserByEmailService(String(email).trim());
    if (!user) {
      return res.status(404).json({
        message: "Email not registered",
        success: false,
      });
    }
    const emailAlreadySent = await redis.get(`otpForEmail:${email}`);
    if (!emailAlreadySent) {
      const OTP = generateOTP();
      const salt = await bcrypt.genSalt(10);
      const hashedOTP = await bcrypt.hash(String(OTP), salt);
      const sentMailResult: boolean = await sendPasswordResetEmail(
        email,
        user.name,
        3,
        OTP,
      );
      if (!sentMailResult) {
        return res.status(500).json({
          message: "Failed to send email, please try again",
          success: false,
        });
      }
      await redis.set(`otpForEmail:${email}`, hashedOTP, {
        EX: 180,
      });
      return res.status(200).json({
        message: "OTP sent at registered email",
        success: true,
      });
    } else {
      const timeLeft = await redis.ttl(`otpForEmail:${email}`);
      let sendTime = `${timeLeft} seconds`;
      if (Number(timeLeft) >= 60)
        sendTime = `${Math.floor(timeLeft / 60)} minutes and ${Math.floor(timeLeft % 60)} seconds`;

      return res.status(400).json({
        message: `Please wait ${sendTime} before requesting a new OTP`,
        success: false,
      });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const forgotPasswordController = async (req: Request, res: Response) => {
  try {
    const body = req.body;
    const { otpEntered, newPassword, email } = body;
    const actualPassword = String(newPassword).trim();
    if (!otpEntered) {
      return res.status(400).json({
        message: "OTP is required",
        success: false,
      });
    }
    if (!email) {
      return res.status(400).json({
        message: "Email is required",
        success: false,
      });
    }
    if (!newPassword || actualPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters long",
        success: false,
      });
    }
    const attempts = await redis.get(`emailAttempts:${email}`);
    if (attempts && Number(attempts) === 4) {
      await redis.set(`emailAttempts:${email}`, 5, {
        EX: 180,
      });
    }
    if (attempts && Number(attempts) >= 5) {
      const timeLeft = await redis.ttl(`emailAttempts:${email}`);
      let sendTime = `${timeLeft} seconds`;
      if (Number(timeLeft) >= 60) {
        sendTime = `${Math.floor(timeLeft / 60)} minutes and ${Math.floor(timeLeft % 60)} seconds`;
      }
      return res.status(403).json({
        message: `You have entered incorrect OTP more than 5 times, please wait ${sendTime} before retrying`,
        success: false,
      });
    }
    const actualOTP = await redis.get(`otpForEmail:${email}`);
    if (!actualOTP) {
      return res.status(404).json({
        message: "OTP expired, request a new one",
        success: false,
      });
    }
    const compareOTP = String(otpEntered).trim();
    const matchOTP = await bcrypt.compare(compareOTP, actualOTP);
    if (!matchOTP) {
      const attempts = await redis.incr(`emailAttempts:${email}`);
      await redis.set(`emailAttempts:${email}`, attempts, { EX: 180 });
      // const attemptsMade = await redis.get(`emailAttempts:${email}`);
      return res.status(400).json({
        message: `Incorrect OTP, ${5 - Number(attempts)} attempts left`,
        success: false,
      });
    }
    const user = await getUserByEmailService(email);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
        success: false,
      });
    }
    await updatePasswordService(user._id, newPassword);
    await redis.del(`otpForEmail:${email}`);
    await redis.del(`emailAttempts:${email}`);
    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};

export const updatePasswordByOtpController = async (
  req: Request | any,
  res: Response,
) => {
  try {
    const body = req.body;
    const { otpEntered, newPassword } = body;
    const actualPassword = String(newPassword).trim();
    if (!otpEntered) {
      return res.status(400).json({
        message: "OTP is required",
        success: false,
      });
    }

    if (!newPassword || actualPassword.length < 8) {
      return res.status(400).json({
        message: "Password must be atleast 8 characters long",
        success: false,
      });
    }
    const user = await getUserService(req.userId);
    if (!user) {
      return res.status(200).json({
        message: "User not found",
        success: false,
      });
    }
    const email = user?.email;
    const attempts = await redis.get(`emailAttempts:${email}`);
    if (attempts && Number(attempts) === 4) {
      await redis.set(`emailAttempts:${email}`, 5, {
        EX: 180,
      });
    }
    if (attempts && Number(attempts) >= 5) {
      const timeLeft = await redis.ttl(`emailAttempts:${email}`);
      let sendTime = `${timeLeft} seconds`;
      if (Number(timeLeft) >= 60) {
        sendTime = `${Math.floor(timeLeft / 60)} minutes and ${Math.floor(timeLeft % 60)} seconds`;
      }
      return res.status(403).json({
        message: `You have entered incorrect OTP more than 5 times, please wait ${sendTime} before retrying`,
        success: false,
      });
    }

    const compareOTP = String(otpEntered).trim();
    const actualOTP = await redis.get(`otpForEmail:${email}`);
    if (!actualOTP) {
      return res.status(404).json({
        message: "OTP expired, request a new one",
        success: false,
      });
    }
    const matchOTP = await bcrypt.compare(compareOTP, actualOTP);
    if (!matchOTP) {
      const attempts = await redis.incr(`emailAttempts:${email}`);
      await redis.set(`emailAttempts:${email}`, attempts, { EX: 180 });
      return res.status(400).json({
        message: `Incorrect OTP, ${5 - Number(attempts)} attempts left`,
        success: false,
      });
    }
    await updatePasswordService(user?._id, newPassword);
    await redis.del(`otpForEmail:${email}`);
    await redis.del(`emailAttempts:${email}`);
    return res.status(200).json({
      message: "Password updated successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: messages[0],
        success: false,
      });
    }
    return res.status(500).json({
      message: "Internal Server Error",
      success: false,
    });
  }
};
