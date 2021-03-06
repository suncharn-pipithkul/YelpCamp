const BaseJoi = require('joi'); // Js Object validator
const sanitizeHtml = require('sanitize-html');

const extension = (joi)=> ({
  type: 'string',
  base: joi.string(),
  messages: {
    'string.escapeHTML': '{{#label}} must not include HTML!'
  },
  rules: {
    escapeHTML: {
      validate(value, helpers) {
        // Remove Html
        const clean = sanitizeHtml(value, {
          allowedTag: [],
          allowedAttributes: {},
        });

        if (clean.replace('&amp;', '&') !== value)
          return helpers.error('string.escapeHTML', { value });
        return clean;
      }
    }
  }
});

const Joi = BaseJoi.extend(extension);

module.exports.campgroundSchema = Joi.object({
  campground: Joi.object({
    title: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    category: Joi.alternatives().try(Joi.string(), Joi.array().items(Joi.string())), // string OR arr of strings
    // image: Joi.string().required(), // Let multer + cloudinary validate images
    price: Joi.number().required().min(0),
    description: Joi.string().required().escapeHTML()
  }).required(),
  deleteImages: Joi.array()
});

module.exports.reviewSchema = Joi.object({
  review: Joi.object({
    body: Joi.string().required().escapeHTML(),
    rating: Joi.number().required().min(0).max(5)
  }).required()
});