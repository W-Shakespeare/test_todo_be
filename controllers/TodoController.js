import TodoModel from "../models/todo.js";

export const create = async (req, res) => {
  console.log("req.user", req.user);

  try {
    const doc = new TodoModel({
      // title: req.body.title,
      text: req.body.text,
      user: req.user,
    });
    console.log(3333);
    const todo = await doc.save();
    return res.status(201).json({ todo });
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getAllTodos = async (req, res) => {
  try {
    const todos = await TodoModel.find();
    return res.json(todos);
  } catch (err) {
    return res.status(500).json(err);
  }
};

export const getTodoById = async (req, res) => {
  try {
    // const Tm = mongoose.model("todos");
    // const todo = await Tm.findById(req.params.id);

    const todo = await TodoModel.findById(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the todo" });
  }
};

export const deleteTodoById = async (req, res) => {
  try {
    const todo = await TodoModel.findByIdAndDelete(req.params.id);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the todo" });
  }
};

export const updateTodoById = async (req, res) => {
  console.log("req.params", req.params);
  console.log("req.body", req.body);

  try {
    const todo = await TodoModel.findByIdAndUpdate(
      req.params.id,
      {
        // title: req.body.title,
        text: req.body.text,
      },
      { new: true }
    );

    console.log("todo____", todo);

    if (!todo) {
      return res.status(404).json({ error: "Todo not found" });
    }

    res.status(200).json(todo);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving the todo" });
  }
};
