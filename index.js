const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./config/db");
const Todo = require("./models/Todos");
const app = express();
const PORT = 8080;

// Connect to MongoDB
connectDB();

app.use(bodyParser.json());
app.use(cors());

// CRUD APIs

// Get all todos
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Get a single todo by ID
app.get("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Create a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const { title, task, description, completed } = req.body;
    const newTodo = new Todo({
      title,
      task,
      description,
      completed,
    });
    const todo = await newTodo.save();
    res.status(201).json(todo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const { title, task, description, completed } = req.body;
    const updatedTodo = await Todo.findByIdAndUpdate(
      req.params.id,
      { title, task, description, completed },
      { new: true }
    );
    if (!updatedTodo) {
      return res.status(404).send("Todo not found");
    }
    res.json(updatedTodo);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const deletedTodo = await Todo.findByIdAndDelete(req.params.id);
    if (!deletedTodo) {
      return res.status(404).send("Todo not found");
    }
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
