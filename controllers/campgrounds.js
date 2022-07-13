const Campground = require('../models/campground');


// All campgrounds page
module.exports.index = async (req, res) => {
  const campgrounds = await Campground.find({});
  res.render('campgrounds/index.ejs', { campgrounds });
};

// Create new campground page
module.exports.renderNewForm = (req, res) => {
  res.render('campgrounds/new.ejs');
};

// Submit new campground route
module.exports.createCampground = async (req, res) => {
  const campground = new Campground(req.body.campground);
  campground.images = req.files.map(f => { return { url: f.path, filename: f.filename } });
  campground.author = req.user._id;
  await campground.save();

  req.flash('success', 'Successfully made a new campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

// View campground detail page
module.exports.showCampground = async (req, res) => {
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
};

// Edit campground page
module.exports.renderEditForm = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findById(id);
  if (!campground) {
    req.flash('error', 'Cannot find that campground!');
    return res.redirect('/campgrounds');
  }
  res.render('campgrounds/edit.ejs', { campground });
};

// Submit edit campground route
module.exports.updateCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndUpdate(id, { ...req.body.campground });

  req.flash('success', 'Successfully updated the campground!');
  res.redirect(`/campgrounds/${campground._id}`);
};

// Delete campground route
module.exports.deleteCampground = async (req, res) => {
  const { id } = req.params;
  const campground = await Campground.findByIdAndDelete(id);

  req.flash('success', 'Successfully deleted the campground!');
  res.redirect(`/campgrounds`);
};