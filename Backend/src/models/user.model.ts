import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: [true, "Email already registered"],
      match: [
        /^((?!\.)[\w-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/gim,
        "Invalid email!",
      ],
      lowercase: true,
    },
    password: {
      type: String,
      minlength: [8, "Password must be atleast 8 characters long"],
      required: [true, "Password is required"],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      minlength: [2, "Name must be atleast 2 characters long"],
    },
    avatar: {
      type: String,
      default:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR8c3Sme0e4y_h5kOcuahoak6p4xVDLvegwHbAiri5NTL6cPQ3YytRXDko&s=10",
    },
  },
  { timestamps: true, strict: true },
);
export const userModel = mongoose.model("user", userSchema);
