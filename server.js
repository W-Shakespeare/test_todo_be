import express from "express";
import mongoose from "mongoose";
import userValidationRules from "./validation/user.js";
import todoValidationRules from "./validation/todo.js";
import * as UserControllers from "./controllers/UserControllers.js";
import * as TodoControllers from "./controllers/TodoController.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import multer from "multer";
import cors from "cors";
import fetch from 'node-fetch';
import TelegramBot from 'node-telegram-bot-api';
const telegramBotApi ='8014981330:AAHuxzKfMUn4ahkjML_kBmBCg-9SxtJinwc'

import UserIdModel from './models/userId.js'

const bot = new TelegramBot(telegramBotApi, { polling: true });
// const users=['442052582']

const getAllUsers = async () => {
  try {
    const users = await UserIdModel.find(); // Получаем все записи из коллекции User
    return users.map(user => user.userId); // Возвращаем массив userId
  } catch (err) {
    console.error('Error fetching users from database:', err);
    return [];
  }
};

const sendBulkMessages = async (message) => {
  try {
    const users = await getAllUsers(); // Получаем всех пользователей
    for (const userId of users) {
      await bot.sendMessage(userId, message); // Отправляем сообщение каждому пользователю
      console.log(`Message sent to ${userId}`);
    }
  } catch (error) {
    console.error('Error sending messages:', error);
  }
};


let previousPrice = null;

const isPriceChangedBy10Percent = (newPrice) => {
  if (previousPrice === null) {
    previousPrice = newPrice;
    return false; 
  }

  const priceChange = Math.abs((newPrice - previousPrice) / previousPrice) * 100;
  return priceChange >= 1;
};


const getELONPrice = async () => {
  try {
    const response = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=dogelon-mars&vs_currencies=usd');
    const data = await response.json();
    const price = data['dogelon-mars']?.usd;
  
    const message = `Текущая цена Dogelon Mars (ELON): $${price}`
    const parsedPrice = parseFloat(price); 
    
    if (isPriceChangedBy10Percent(parsedPrice)){
       await sendBulkMessages(message);
       previousPrice = parsedPrice
      }
  
  } catch (error) {
    console.error('Ошибка при получении данных:', error);
  }
};


// const uri =
//   "mongodb+srv://pixelixanimationstudio:LaGfqFIktNsCWL9z@cluster0.hjsp2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
  const uri =  "mongodb+srv://kir:usXaOSKSlmZOb1Er@cluster0.1dmgl.mongodb.net/"
// const conn = mongoose.createConnection(uri);


dotenv.config();

const verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (token == null) {
    return res.sendStatus(401);
  }
  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
    if (err) {
      return res.sendStatus(403);
    }
    console.log("user", user);
    req.user = user._id;
    next();
  });
};

mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("MongoDB Connected…");
  })
  .catch((err) => {
    console.log("monguse not connected_____");
    console.log(err);
  });

const app = express();
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 3001;

app.post("/register", userValidationRules, UserControllers.register);
app.post("/login", UserControllers.login);
app.post("/todo", verifyToken, todoValidationRules, TodoControllers.create);
app.get("/todo", verifyToken, TodoControllers.getAllTodos);
app.get("/todo/:id", verifyToken, TodoControllers.getTodoById);
app.delete("/todo/:id", verifyToken, TodoControllers.deleteTodoById);
app.put("/todo/:id", verifyToken, TodoControllers.updateTodoById);


// Telegram crypto bot start
app.post('/send-telegram-message', (req, res) => {
  
  const message  = req.body.text; // Получаем сообщение из тела запроса
  if (!message) {
    return res.status(400).send('Message is required');
  }

  sendBulkMessages(message);
  res.send('Messages are being sent');
});


const addUserToDatabase = async (userId) => {
  try {
    const existingUser = await UserIdModel.findOne({ userId });
    if (existingUser) {
      console.log(`User ${userId} already in the database.`);
    } else {
      const newUser = new UserIdModel({ userId });
      await newUser.save();
      console.log(`User ${userId} added to the database.`);
    }
  } catch (err) {
    console.error('Error adding user to the database:', err);
  }
};

bot.onText(/\/start/, async (msg) => {
  const userId = msg.from.id; // Получаем ID пользователя из сообщения
  await addUserToDatabase(userId); // Добавляем в базу данных
  bot.sendMessage(userId, 'Вы включили бота!'); // Отправляем сообщение пользователю
});

setInterval(getELONPrice, 1000 * 60);
// Telegram crypto bot end


app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
