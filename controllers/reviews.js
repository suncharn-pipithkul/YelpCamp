const Campground = require('../models/campground');
const Review = require('../models/review');


// Submit campground review route
module.exports.createReview = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  
  const review = new Review(req.body.review);
  review.author = req.user._id;
  campground.reviews.push(review);
  
  await review.save();
  await campground.save();

  req.flash('success', 'Created new review!');
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete campground review route
module.exports.deleteReview = async (req, res) => {
  const { id, reviewId} = req.params;

  // pull all instance of a value(s) from an existing array that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);

  req.flash('success', 'Successfully deleted the review!');
  res.redirect(`/campgrounds/${id}`);
};