const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const catchAsync = require('./utils/catchAsync');
const Campground = require('./models/campground');
const Review = require('./models/review');
const { reviewSchema } = require('./schema');

const campgroundRoutes = require('./routes/campgrounds');

mongoose.connect('mongodb://localhost:27017/yelp-camp');

const db = mongoose.connection;

// on & once from NodeJs
// Mongoose connections are "EventEmitter"s
// on error event => console.error "connection error:"
// once open event => console.log "Database connected"
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Database connected');
});

const app = express();

app.engine('ejs', ejsMate); // use ejsMate to parse ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// MIDDLEWARE (req => middleware => res)
app.use(express.urlencoded({ extended: true })); // how to parse req.body
// attach query key "_method" in form to override html method
app.use(methodOverride('_method'));

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

// Home page
app.get('/', (req, res) => {
  res.render('home.ejs');
});

// Campground Routes
app.use('/campgrounds', campgroundRoutes);

// Submit campground review route
app.post('/campgrounds/:id/reviews', validateReview, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  const review = new Review(req.body.review);
  campground.reviews.push(review);
  
  await review.save();
  await campground.save();
  res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete campground review route
app.delete('/campgrounds/:id/reviews/:reviewId', catchAsync(async (req, res) => {
  const { id, reviewId} = req.params;

  // pull all instance of a value(s) from an existing array that match a specified condition
  await Campground.findByIdAndUpdate(id, { $pull: { reviews: reviewId }});
  await Review.findByIdAndDelete(reviewId);

  res.redirect(`/campgrounds/${id}`);
}));

// Catch all 404 route
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message)
    err.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error.ejs', { err });
});


const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});