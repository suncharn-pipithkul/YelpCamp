const { cloudinary } = require('../cloudinary');
const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;


const ImageSchema = new Schema({
  url: String,
  filename: String
});

// Method to get smaller image
ImageSchema.virtual('thumbnail').get(function() {
  return this.url.replace('/upload', '/upload/w_200');
});

// Method to crop images to the same size
ImageSchema.virtual('cover').get(function() {
  return this.url.replace('/upload', '/upload/ar_4:3,c_crop');
});

const CampgroundSchema = new Schema({
  title: String,
  images: [ImageSchema],
  price: Number,
  description: String,
  geometry: {
    type: {
      type: String,
      enum: ['Point'],
      required: true
    },
    coordinates: {
      type: [Number],
      required: true
    }
  },
  location: String,
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviews: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Review'
    }
  ]
});

// NOTE: findByIdAndDelete calls findOneAndDelete
// Mongoose middleware when findOneAndDelete is called on a Campground
// We need to delete all reviews related to this campground as well
CampgroundSchema.post('findOneAndDelete', async function (campgroundDoc) {
  if (campgroundDoc) {
    // Delete reviews
    if (campgroundDoc.reviews) {
      await Review.deleteMany({
        _id: {
          $in: campgroundDoc.reviews
        }
      });
    }

    // Delete images from cloudinary
    if (campgroundDoc.images) {
      for (const img of campgroundDoc.images) {
         await cloudinary.uploader.destroy(img.filename);
      }
    }
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);