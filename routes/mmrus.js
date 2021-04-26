const express = require("express");
const router = express.Router();
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");
const Mmru = require("../models/mmru");
const { mmruSchema } = require("../schemas.js");

const validateMmru = (req, res, next) => {
  const { error } = mmruSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.get(
  "/",
  catchAsync(async (req, res) => {
    const mmrus = await Mmru.find({});
    res.render("mmrus/index", { mmrus });
  })
);

router.get("/new", (req, res) => {
  res.render("mmrus/new");
});

router.post(
  "/",
  validateMmru,
  catchAsync(async (req, res, next) => {
    //if (!req.body.mmru) throw new ExpressError("Invalid Data", 400);

    const mmru = new Mmru(req.body.mmru);
    await mmru.save();
    res.redirect(`/mmrus/${mmru._id}`);
  })
);

router.get(
  "/:id",
  catchAsync(async (req, res) => {
    const mmru = await Mmru.findById(req.params.id).populate("avis");
    res.render("mmrus/show", { mmru });
  })
);

router.get(
  "/:id/edit",
  catchAsync(async (req, res) => {
    const mmru = await Mmru.findById(req.params.id);
    res.render("mmrus/edit", { mmru });
  })
);

router.put(
  "/:id",
  validateMmru,
  catchAsync(async (req, res) => {
    const { id } = req.params;
    const mmru = await Mmru.findByIdAndUpdate(id, { ...req.body.mmru });
    res.redirect(`/mmrus/${mmru._id}`);
  })
);

router.delete(
  "/:id",
  catchAsync(async (req, res) => {
    const { id } = req.params;
    await Mmru.findByIdAndDelete(id);
    res.redirect("/mmrus");
  })
);

module.exports = router;
