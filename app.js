const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const ejsMate = require("ejs-mate");
const { mmruSchema, reviewSchema } = require("./schemas.js");
const catchAsync = require("./utils/catchAsync");
const ExpressError = require("./utils/ExpressError");
const methodOverride = require("method-override");
const Mmru = require("./models/mmru");
const Review = require("./models/review");

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

const validateMmru = (req, res, next) => {
  const { error } = mmruSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

app.get("/", (req, res) => {
  res.render("home");
});

app.get(
  "/mmrus",
  catchAsync(async (req, res) => {
    const mmrus = await Mmru.find({});
    res.render("mmrus/index", { mmrus });
  })
);

app.get("/mmrus/new", (req, res) => {
  res.render("mmrus/new");
});

app.post(
  "/mmrus",
  validateMmru,
  catchAsync(async (req, res, next) => {
    //if (!req.body.mmru) throw new ExpressError("Invalid Data", 400);

    const mmru = new Mmru(req.body.mmru);
    await mmru.save();
    res.redirect(`/mmrus/${mmru._id}`);
  })
);

app.get(
  "/mmrus/:id",
  catchAsync(async (req, res) => {
    const mmru = await Mmru.findById(req.params.id).populate("avis");
    res.render("mmrus/show", { mmru });
  })
);

app.get(
  "/mmrus/:id/edit",
  catchAsync(async (req, res) => {
    const mmru = await Mmru.findById(req.params.id);
    res.render("mmrus/edit", { mmru });
  })
);

app.put(
  "/mmrus/:id",
  validateMmru,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const mmru = await Mmru.findByIdAndUpdate(id, { ...req.body.mmru });
    res.redirect(`/mmrus/${mmru._id}`);
  })
);

app.delete(
  "/mmrus/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mmru.findByIdAndDelete(id);
    res.redirect("/mmrus");
  })
);

app.post(
  "/mmrus/:id/reviews",
  validateReview,
  catchAsync(async (req, res) => {
    const mmru = await Mmru.findById(req.params.id);
    const review = new Review(req.body.review);
    mmru.avis.push(review);
    await review.save();
    await mmru.save();
    res.redirect(`/mmrus/${mmru._id}`);
  })
);

app.delete(
  "/mmrus/:id/reviews/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mmru.findByIdAndUpdate(id, { $pull: { avis: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/mmrus/${id}`);
  })
);

app.all("*", (req, res, next) => {
  next(new ExpressError("Page not found", 404));
});

app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message) err.message = "Oh No, something went wrong!";
  res.status(statusCode).render("error", { err });
});

app.listen(3000, () => {
  console.log("port 3000 here");
});
