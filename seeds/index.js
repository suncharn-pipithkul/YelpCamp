const mongoose = require('mongoose');
const cities = require('./cities');
const { places, descriptors } = require('./seedHelpers');
const Campground = require('../models/campground');

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

const sample = (arr) => arr[Math.floor(Math.random() * arr.length)];
const random = (max) => Math.floor(Math.random() * max);

const seedDB = async (amount) => {
  await Campground.deleteMany({});
  for (let i = 0; i < amount; i++) {
    const rand = random(cities.length);
    const price = random(20) + 10;
    const camp = new Campground({
      author: '62ca7e0a039259892c46b344',
      location: `${cities[rand].city}, ${cities[rand].state}`,
      title: `${sample(descriptors)} ${sample(places)}`,
      description: 'Lorem ipsum dolor sit, amet consectetur adipisicing elit. Ex, molestias consectetur aliquid praesentium beatae maxime labore fuga, fugit hic optio possimus eaque mollitia fugiat? Eveniet cumque laudantium facere vel voluptas?',
      price,
      images: [
        {
          url: "https://res.cloudinary.com/dhqivgfzq/image/upload/v1657677038/YelpCamp/forcxvbqmdhcgb4t2qfa.jpg",
          filename: "YelpCamp/forcxvbqmdhcgb4t2qfa"
        },
        {
          url: "https://res.cloudinary.com/dhqivgfzq/image/upload/v1657677002/YelpCamp/zcuexqvtupgotxgtstxy.jpg",
          filename: "YelpCamp/zcuexqvtupgotxgtstxy"
        },
        {
          url: "https://res.cloudinary.com/dhqivgfzq/image/upload/v1657676979/YelpCamp/kfpxxaeajcxfuaugtzji.jpg",
          filename: "YelpCamp/kfpxxaeajcxfuaugtzji"
        }
      ]
    });

    await camp.save();
  }
}

seedDB(50).then(() => {
  console.log('Seed done');
  console.log('Database disconnected');
  db.close();
});