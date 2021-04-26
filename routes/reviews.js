const express = require("express");
const router = express.Router({ mergeParams: true });
const Mmru = require("../models/mmru");
const Review = require("../models/review");
const { reviewSchema } = require("../schemas.js");
const catchAsync = require("../utils/catchAsync");
const ExpressError = require("../utils/ExpressError");

const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map((el) => el.message).join(",");
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

router.post(
  "/",
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

router.delete(
  "/:reviewId",
  catchAsync(async (req, res) => {
    const { id, reviewId } = req.params;
    await Mmru.findByIdAndUpdate(id, { $pull: { avis: reviewId } });
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/mmrus/${id}`);
  })
);

module.exports = router;
