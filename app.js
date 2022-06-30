const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const Campground = require('./models/campground');

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

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

app.get('/', (req, res) => {
  res.render('home.ejs');
});

app.get('/makecampground', async (req, res) => {
  const camp = new Campground({
    title: 'My Backyard',
    description: 'cheap camping!'
  });

  await camp.save();
  res.send(camp);
})

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});