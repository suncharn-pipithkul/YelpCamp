const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');

const catchAsync = require('../utils/catchAsync');
const Campground = require('../models/campground');
const { isLoggedIn, validateCampground, isCampgroundAuthor } = require('../middleware');


// All campgrounds page
router.get('/', catchAsync(campgroundController.index));

// Create new campground page
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

// Submit new campground route
router.post('/', isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground));

// View campground detail page
router.get('/:id', catchAsync(campgroundController.showCampground));

// Edit campground page
router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.renderEditForm));

// Submit edit campground route
router.put('/:id', isLoggedIn, isCampgroundAuthor, validateCampground, catchAsync(campgroundController.updateCampground));

// Delete campground route
router.delete('/:id', isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground));


module.exports = router;