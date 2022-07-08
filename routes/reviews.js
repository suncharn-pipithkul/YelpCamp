const express = require('express');
const router = express.Router({ mergeParams: true }); // pass params from main path to here

const Campground = require('../models/campground');
const Review = require('../models/review');

const { reviewSchema } = require('../schema');

const catchAsync = require('../utils/catchAsync');

// server-side review object validation function/middleware
const validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

// Submit campground review route
router.post('/', validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  
  await review.save();
  await campground.save();

  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete campground review route
router.delete('/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId} = req.params;

  // pull all instance of a value(s) from an existing array that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);

  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/campgrounds/${id}`);
}));


module.exports = router;