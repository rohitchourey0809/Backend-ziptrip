const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");

const app = express();
const PORT = 8080;

app.use(bodyParser.json());
app.use(cors());

let todos = [];

// Load todos from file
fs.readFile("todos.json", (err, data) => {
  if (!err) {
    todos = JSON.parse(data);
  }
});

// Save todos to file
function saveTodos() {
  fs.writeFile("todos.json", JSON.stringify(todos), (err) => {
    if (err) console.error("Error saving todos", err);
  });
}

// CRUD APIs

// Get all todos
app.get("/api/todos", (req, res) => {
  res.json(todos);
});

// Get a single todo by ID
app.get("/api/todos/:id", (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (todo) {
    res.json(todo);
  } else {
    res.status(404).send("Todo not found");
  }
});

// Create a new todo
app.post("/api/todos", (req, res) => {
  const newTodo = { id: Date.now(), ...req.body };
  todos.push(newTodo);
  saveTodos();
  res.status(201).json(newTodo);
});

// Update a todo
app.put("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (index !== -1) {
    todos[index] = { ...todos[index], ...req.body };
    saveTodos();
    res.json(todos[index]);
  } else {
    res.status(404).send("Todo not found");
  }
});

// Delete a todo
app.delete("/api/todos/:id", (req, res) => {
  const index = todos.findIndex((t) => t.id === parseInt(req.params.id));
  if (index !== -1) {
    todos.splice(index, 1);
    saveTodos();
    res.status(204).send();
  } else {
    res.status(404).send("Todo not found");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
