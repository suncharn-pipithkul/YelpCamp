const express = require('express');
const router = express.Router({ mergeParams: true }); // pass params from main path to here
const reviewController = require('../controllers/reviews');

const { validateReview, isLoggedIn, isReviewAuthor } = require('../middleware');

const catchAsync = require('../utils/catchAsync');


// Submit campground review route
router.post('/', isLoggedIn, validateReview, catchAsync(reviewController.createReview));

// Delete campground review route
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, catchAsync(reviewController.deleteReview));


module.exports = router;