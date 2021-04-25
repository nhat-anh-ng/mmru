const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const methodOverride = require("method-override");
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

app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));

app.get("/", (req, res) => {
  res.render("home");
});

app.get("/mmrus", async (req, res) => {
  const mmrus = await Mmru.find({});
  res.render("mmrus/index", { mmrus });
});

app.get("/mmrus/new", (req, res) => {
  res.render("mmrus/new");
});

app.post("/mmrus", async (req, res) => {
  const mmru = new Mmru(req.body.mmru);
  await mmru.save();
  res.redirect(`/mmrus/${mmru._id}`);
});

app.get("/mmrus/:id", async (req, res) => {
  const mmru = await Mmru.findById(req.params.id);
  res.render("mmrus/show", { mmru });
});

app.get("/mmrus/:id/edit", async (req, res) => {
  const mmru = await Mmru.findById(req.params.id);
  res.render("mmrus/edit", { mmru });
});

app.put("/mmrus/:id", async (req, res) => {
  const { id } = req.params;
  const mmru = await Mmru.findByIdAndUpdate(id, { ...req.body.mmru });
  res.redirect(`/mmrus/${mmru._id}`);
});

app.delete("/mmrus/:id", async (req, res) => {
  const { id } = req.params;
  await Mmru.findByIdAndDelete(id);
  res.redirect("/mmrus");
});

app.listen(3000, () => {
  console.log("port 3000 here");
});
