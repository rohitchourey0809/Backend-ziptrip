// todo-backend/app.js
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const todosRoutes = require("./routes/todos");

const app = express();
const PORT = 5000;

app.use(
  cors({
    credentials: true,
  })
);
app.use(bodyParser.json());
app.use("/todos", todosRoutes);

app.listen(PORT, () =>
  console.log(`Server running on port http://localhost:${PORT}`)
);
