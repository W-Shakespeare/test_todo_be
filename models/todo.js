import mongoose from "mongoose";

const TodoSchema = new mongoose.Schema(
  {
    // title: {
    //   type: String,
    //   required: true,
    //   minlength: 3,
    //   trim: true, // Удаление пробелов по краям
    // },
    text: {
      type: String,
      required: true,
      minlength: 1,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    // avatarUrl: String,
  },
  { timestamps: true }
);

export default mongoose.model("Todo", TodoSchema);
