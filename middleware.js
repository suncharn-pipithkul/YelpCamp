const ExpressError = require('./utils/ExpressError');
const { campgroundSchema, reviewSchema } = require('./schema');
const Campground = require('./models/campground');


module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.flash('error', 'You must be signed in first');
    return res.redirect('/login');
  }

  next();
};

// server-side campground object validation function/middleware
module.exports.validateCampground = (req, res, next) => {
  const { error } = campgroundSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};

module.exports.isAuthor = async (req, res, next) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground.author.equals(req.user._id)) {
    req.flash('error', 'You have to be the author of this campground to do that!');
    return res.redirect(`/campgrounds/${id}`);
  }

  return next();
};

// server-side review object validation function/middleware
module.exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body);
  if (error) {
    const msg = error.details.map(el => el.message).join(',');
    throw new ExpressError(msg, 400);
  } else {
    next();
  }
};