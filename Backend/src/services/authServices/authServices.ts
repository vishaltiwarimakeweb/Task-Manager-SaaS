import type { ObjectIdQueryTypeCasting } from "mongoose";
import { userModel } from "../../models/user.model.js";
import type { User } from "../../types/types.js";
import bcrypt from "bcrypt";

export const registerUserService = async (userData: User) => {
  const newUser = await userModel.create(userData);
  return newUser;
};

export const deleteUserService = async (userId: ObjectIdQueryTypeCasting) => {
  const deletedUser = await userModel.findById(userId);
  return deletedUser;
};

export const updateUserService = async (
  userId: ObjectIdQueryTypeCasting,
  data: any,
) => {
  const updatedUser = await userModel.findByIdAndUpdate(userId, data, {
    new: true,
  });
  return updatedUser;
};

export const getUserService = async (userId: ObjectIdQueryTypeCasting) => {
  const user = await userModel.findById(userId).select("-password");
  return user;
};

export const getFullUserService = async (userId: ObjectIdQueryTypeCasting) => {
  const user = await userModel.findById(userId);
  return user;
};

export const getUserByEmailService = async (email: string) => {
  const user = await userModel.findOne({ email });
  return user;
};

export const updatePasswordService = async (
  userId: ObjectIdQueryTypeCasting,
  password: string,
) => {
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(password, salt);
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      password: hashPassword,
    },
    { new: true },
  );
  return updatedUser;
};

export const updateEmailService = async (
  userId: ObjectIdQueryTypeCasting,
  newEmail: string,
) => {
  const updatedUser = await userModel.findByIdAndUpdate(
    userId,
    {
      email: newEmail,
    },
    { new: true },
  );
  return updatedUser;
};
