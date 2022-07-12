const express = require('express');
const router = express.Router();
const campgroundController = require('../controllers/campgrounds');
const multer = require('multer'); // multiform/form-data parser for form submitting file
const upload = multer({ dest: 'uploads/' });

const catchAsync = require('../utils/catchAsync');
const { isLoggedIn, validateCampground, isCampgroundAuthor } = require('../middleware');


// GET: All campgrounds page
// POST: Submit new campground route
router.route('/')
  .get(catchAsync(campgroundController.index))
  // .post(isLoggedIn, validateCampground, catchAsync(campgroundController.createCampground));
  .post(upload.array('image'), (req, res) => {
    console.dir(req.files);
    res.send(req.body);
  })

// Create new campground page
router.get('/new', isLoggedIn, campgroundController.renderNewForm);

// GET: View campground detail page
// PUT: Submit edit campground route
// DELETE: Delete campground route
router.route('/:id')
  .get(catchAsync(campgroundController.showCampground))
  .put(
    isLoggedIn, 
    isCampgroundAuthor, 
    validateCampground, 
    catchAsync(campgroundController.updateCampground))
  .delete(isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.deleteCampground));

// Edit campground page
router.get('/:id/edit', isLoggedIn, isCampgroundAuthor, catchAsync(campgroundController.renderEditForm));




module.exports = router;