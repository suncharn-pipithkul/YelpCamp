const express = require('express');
const router = express.Router();

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isAuthor } = require('../middleware');


// All campgrounds page
router.get('/', catchAsync(async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index.ejs', { campgrounds });
}));

// Create new campground page
router.get('/new', isLoggedIn, (req, res) => {
  res.render('campgrounds/new.ejs');
});

// Submit new campground route
router.post('/', isLoggedIn, validateCampground, catchAsync(async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.author = req.user._id;
  await campground.save();

  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

// View campground detail page
router.get('/:id', catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id).populate({ 
    path: 'reviews',
    populate: {
      path: 'author', // populate reviews' author
      // select: 'username -_id' // get only username + explicitly exclude _id
    }
  }).populate('author', 'username'); // populate campground's author's username

  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/show.ejs', { campground });
}));

// Edit campground page
router.get('/:id/edit', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit.ejs', { campground });
}));

// Submit edit campground route
router.put('/:id', isLoggedIn, isAuthor, validateCampground, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

  req.flash('success', 'Successfully updated the campground!');
  res.redirect(`/campgrounds/${campground._id}`);
}));

// Delete campground route
router.delete('/:id', isLoggedIn, isAuthor, catchAsync(async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);

  req.flash('success', 'Successfully deleted the campground!');
  res.redirect(`/campgrounds`);
}));


module.exports = router;