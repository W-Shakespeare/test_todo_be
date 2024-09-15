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

const uri =
  "mongodb+srv://pixelixanimationstudio:LaGfqFIktNsCWL9z@cluster0.hjsp2.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
const port = 3001;

app.post("/register", userValidationRules, UserControllers.register);
app.post("/login", UserControllers.login);
app.post("/todo", verifyToken, todoValidationRules, TodoControllers.create);
app.get("/todo", verifyToken, TodoControllers.getAllTodos);
app.get("/todo/:id", verifyToken, TodoControllers.getTodoById);
app.delete("/todo/:id", verifyToken, TodoControllers.deleteTodoById);
app.put("/todo/:id", verifyToken, TodoControllers.updateTodoById);

// app.get("/todo", (req, res) => {
//   res.json([{ value: "11", id: 1 }]);
// });

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`);
});
