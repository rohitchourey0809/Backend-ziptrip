const express = require("express");
const fs = require("fs");
const path = require("path");
const router = express.Router();

const filePath = path.join(__dirname, "../data/todos.json");

// Get all shopping items
router.get("/", (req, res) => {
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      const todos = JSON.parse(data);
      res.json(todos.Shopping);
    }
  });
});

// Get a single shopping item by id
router.get("/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      const todos = JSON.parse(data);
      const todo = todos.Shopping.find((t) => t.id === parseInt(id));
      if (todo) {
        res.json(todo);
      } else {
        res.status(404).json({ error: "Todo not found" });
      }
    }
  });
});

// Create a new shopping item
router.post("/", (req, res) => {
  const newTodo = req.body;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      const todos = JSON.parse(data);
      newTodo.id = todos.Shopping.length
        ? todos.Shopping[todos.Shopping.length - 1].id + 1
        : 1;
      todos.Shopping.push(newTodo);
      fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
        if (err) {
          res.status(500).json({ error: "Failed to write data" });
        } else {
          res.status(201).json(newTodo);
        }
      });
    }
  });
});

// Update a shopping item by id
router.put("/:id", (req, res) => {
  const id = req.params.id;
  const updatedTodo = req.body;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      let todos = JSON.parse(data);
      const todoIndex = todos.Shopping.findIndex((t) => t.id === parseInt(id));
      if (todoIndex !== -1) {
        todos.Shopping[todoIndex] = {
          ...todos.Shopping[todoIndex],
          ...updatedTodo,
        };
        fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to write data" });
          } else {
            res.json(todos.Shopping[todoIndex]);
          }
        });
      } else {
        res.status(404).json({ error: "Todo not found" });
      }
    }
  });
});

// Delete a shopping item by id
router.delete("/:id", (req, res) => {
  const id = req.params.id;
  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(500).json({ error: "Failed to read data" });
    } else {
      let todos = JSON.parse(data);
      const initialLength = todos.Shopping.length;
      todos.Shopping = todos.Shopping.filter((t) => t.id !== parseInt(id));
      if (todos.Shopping.length < initialLength) {
        fs.writeFile(filePath, JSON.stringify(todos, null, 2), (err) => {
          if (err) {
            res.status(500).json({ error: "Failed to write data" });
          } else {
            res.status(204).send();
          }
        });
      } else {
        res.status(404).json({ error: "Todo not found" });
      }
    }
  });
});

module.exports = router;
