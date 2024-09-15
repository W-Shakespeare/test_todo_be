import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      minlength: 3,
      trim: true, // Удаление пробелов по краям
    },
    password: {
      type: String,
      required: true,
      minlength: 5,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("User", UserSchema);
