const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const Mmru = require("./models/mmru");

mongoose.connect("mongodb://localhost:27017/mmru", {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
  console.log("Database connected");
});

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.get("/", (req, res) => {
  res.render("home");
});
app.get("/makemmru", async (req, res) => {
  const mmru = new Mmru({ ville: "Paris", adresse: "123RueAbeil" });
  await mmru.save();
  res.send(mmru);
});
app.listen(3000, () => {
  console.log("port 3000 here");
});
