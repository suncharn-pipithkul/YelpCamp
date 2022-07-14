const Joi = require('joi'); // Js Object validator

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required(),
    location: Joi.string().required(),
    // image: Joi.string().required(), // Let multer + cloudinary validate images
    price: Joi.number().required().min(0),
    description: Joi.string().required()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required(),
    rating: Joi.number().required().min(0).max(5)
  }).required()
});