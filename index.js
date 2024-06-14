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
    res.status(500).send("Server Error");
  }
});

// Create a new todo
app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = new Todo({
      title: req.body.title,
      task: req.body.task,
      description: req.body.description,
      completed: req.body.completed,
    });
    const todo = await newTodo.save();
    res.status(201).json(todo);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update a todo
app.put("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true } // Return the updated document
    );
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.json(todo);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Delete a todo
app.delete("/api/todos/:id", async (req, res) => {
  try {
    const todo = await Todo.findByIdAndRemove(req.params.id);
    if (!todo) {
      return res.status(404).send("Todo not found");
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
