const express = require("express");
const mongoose = require("mongoose");
require('dotenv').config()

// Config
let uri = process.env.MONGODB_URI;
let PORT = 8080;

const app = express();
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Schema
const taskSchema = new mongoose.Schema({
  task: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});
let todoTask = mongoose.model("TodoTask", taskSchema);

// Routes
app.get("/", async (req, res) => {
  let tasks = await todoTask.find({});
  res.render("index.ejs", { todoTasks: tasks });
});

app.post("/add", async (req, res) => {
  const task = new todoTask({
    task: req.body.task,
  });
  try {
    await task.save();
    res.redirect("/");
  } catch (err) {
    console.log("[DB] Error adding task", err);
    res.redirect("/");
  }
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    await todoTask.findByIdAndDelete(id);
    res.redirect("/");
  } catch (err) {
    console.log("[DB] Error deleting task", err);
    res.redirect("/");
  }
});

mongoose.connect(uri).then(() => {
  console.log("Connected to the database");
  app.listen(PORT, (err) => {
    if (err) console.log(err);
    console.log(`Server running on http://localhost:${PORT}`);
  });
});
