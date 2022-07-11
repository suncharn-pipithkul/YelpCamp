const express = require('express');
const router = express.Router({ mergeParams: true }); // pass params from main path to here

const Campground = require('../models/campground');
const Review = require('../models/review');
const { validateReview, isLoggedIn } = require('../middleware');

const catchAsync = require('../utils/catchAsync');


// Submit campground review route
router.post('/', isLoggedIn, validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  review.author = req.user._id;
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