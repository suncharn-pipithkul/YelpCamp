const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Associate this object with the cloudinary account we have
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Settings for our cloudinary storage that works with multer
const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'YelpCamp',
    allowed_formats: [ 'apng', 'avif', 'gif', 'jpeg', 'png', 'jpg', 'webp', 'svg' ]
  }
});


module.exports = {
  cloudinary,
  storage
}