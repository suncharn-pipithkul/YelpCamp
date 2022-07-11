const mongoose = require('mongoose');
const Review = require('./review');
const Schema = mongoose.Schema;

const CampgroundSchema = new Schema({
  title: String,
  image: String,
  price: Number,
  description: String,
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
    await Review.deleteMany({
      _id: {
        $in: campgroundDoc.reviews
      }
    });
  }
});

module.exports = mongoose.model('Campground', CampgroundSchema);