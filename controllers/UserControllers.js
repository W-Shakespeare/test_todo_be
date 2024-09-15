import bcrypt from "bcrypt";
import UserModel from "../models/user.js";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";

export const register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Возвращение ошибок валидации
      return res.status(400).json({ errors: errors.array() });
    }

    const { username, password, email } = req.body;

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new UserModel({
      username,
      password: passwordHash,
      email,
    });

    const user = await newUser.save();

    // Создание токена для пользователя после регистрации
    console.log(
      "process.env.ACCESS_TOKEN_SECRET",
      process.env.ACCESS_TOKEN_SECRET
    );
    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);

    // Если валидация успешна, продолжение обработки
    res.status(201).json({
      msg: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
      },
      token, // Возвращение токена пользователю
    });
  } catch (err) {
    if (err.code && err.code === 11000) {
      return res.status(400).json({ error: "Email already exists" });
    }
    console.log(err);
    res.status(500).json(err);
  }
};

export const login = async (req, res) => {
  try {
    const { password, email } = req.body;
    const user = await UserModel.findOne({
      email,
    });

    if (!user) return res.status(404).json("User not exist");
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword)
      return res.status(404).json("Invalid user and password");

    const token = jwt.sign({ _id: user._id }, process.env.ACCESS_TOKEN_SECRET);
    const { password: passwordHash, ...userData } = user._doc;

    res.status(200).json({ ...userData, token });
  } catch (err) {
    res.status(500);
  }
};
