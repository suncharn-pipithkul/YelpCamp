if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const path = require('path');
const express = require('express');
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const ejsMate = require('ejs-mate');
const ExpressError = require('./utils/ExpressError');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const flash = require('connect-flash');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const User = require('./models/user');

// Security Packages
const mongoSanitize = require('express-mongo-sanitize'); // prevent Mongo injection
const helmet = require('helmet'); // set HTTP headers for security

const userRoutes = require('./routes/users');
const campgroundRoutes = require('./routes/campgrounds');
const reviewRoutes = require('./routes/reviews');

const mongodb_url = process.env.MONGODB_URL || 'mongodb://localhost:27017/yelp-camp';
mongoose.connect(mongodb_url);

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

app.engine('ejs', ejsMate); // use ejsMate to parse ejs
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// MIDDLEWARE (req => middleware => res)
app.use(express.static(path.join(__dirname, '/public'))); // static files ( JS & CSS )
app.use(express.urlencoded({ extended: true })); // how to parse req.body
app.use(methodOverride('_method')); // attach query key "_method" in form to override html method

const mongodb_secret = process.env.MONGODB_SECRET || 'ThisShouldBeABetterSecret!';
const sessionConfig = {
  name: 'session',
  secret: mongodb_secret,
  resave: false,
  saveUninitialized: true,
  cookie: {
    httpOnly: true, // the cookie can't be accessed through client side script ( prevent XSS flaw)
    // secure: true, // cookie works only on HTTPS
    expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
    maxAge: 1000 * 60 * 60 * 24 * 7,
    sameSite: 'strict'
  },
  store: MongoStore.create({
    mongoUrl: mongodb_url,
    touchAfter: 24 * 60 * 60,
    crypto: {
      secret: mongodb_secret
    }
  })
};
app.use(session(sessionConfig));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session()); // persistent login session (MUST BE AFTER session() middleware)
passport.use(new LocalStrategy(User.authenticate())); // tell passport authentication method
passport.serializeUser(User.serializeUser()); // tell passport how to get user into the session
passport.deserializeUser(User.deserializeUser()); // tell passport how to get user out of the session

app.use(mongoSanitize());
const scriptSrcUrls = [
  "https://stackpath.bootstrapcdn.com/",
  "https://api.tiles.mapbox.com/",
  "https://api.mapbox.com/",
  "https://kit.fontawesome.com/",
  "https://cdnjs.cloudflare.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dhqivgfzq/"
];
const styleSrcUrls = [
  "https://kit-free.fontawesome.com/",
  "https://stackpath.bootstrapcdn.com/",
  "https://api.mapbox.com/",
  "https://api.tiles.mapbox.com/",
  "https://fonts.googleapis.com/",
  "https://use.fontawesome.com/",
  "https://cdn.jsdelivr.net/",
  "https://res.cloudinary.com/dhqivgfzq/"
];
const connectSrcUrls = [
  "https://*.tiles.mapbox.com",
  "https://api.mapbox.com",
  "https://events.mapbox.com",
  "https://res.cloudinary.com/dhqivgfzq/"
];
const fontSrcUrls = [ "https://res.cloudinary.com/dhqivgfzq/" ];

app.use(
  helmet({
      contentSecurityPolicy: {
          directives : {
              defaultSrc : [],
              connectSrc : [ "'self'", ...connectSrcUrls ],
              scriptSrc  : [ "'unsafe-inline'", "'self'", ...scriptSrcUrls ],
              styleSrc   : [ "'self'", "'unsafe-inline'", ...styleSrcUrls ],
              workerSrc  : [ "'self'", "blob:" ],
              objectSrc  : [],
              imgSrc     : [
                  "'self'",
                  "blob:",
                  "data:",
                  "https://res.cloudinary.com/dhqivgfzq/", //SHOULD MATCH YOUR CLOUDINARY ACCOUNT!
                  "https://images.unsplash.com/"
              ],
              fontSrc    : [ "'self'", ...fontSrcUrls ],
              mediaSrc   : [ "https://res.cloudinary.com/dhqivgfzq/" ],
              childSrc   : [ "blob:" ]
          }
      },
      crossOriginEmbedderPolicy: false
  })
);


app.use((req, res, next) => {
  // store original requested url in session, if not coming from login or landing page
  if (!['/login', '/'].includes(req.originalUrl)) {
    req.session.returnTo = req.originalUrl;
  }
  res.locals.currentUser = req.user; // MUST BE AFTER serializeUser + deserializeUser
  res.locals.success = req.flash('success');
  res.locals.error = req.flash('error');
  next();
});



// Home page
app.get('/', (req, res) => {
  res.render('home.ejs');
});

// Routes
app.use('/', userRoutes);
app.use('/campgrounds', campgroundRoutes);
app.use('/campgrounds/:id/reviews', reviewRoutes);

// Catch all 404 route
app.all('*', (req, res, next) => {
  next(new ExpressError('Page Not Found', 404));
});

// Error middleware
app.use((err, req, res, next) => {
  const { statusCode = 500 } = err;
  if (!err.message)
    err.message = 'Oh no, something went wrong!';
  res.status(statusCode).render('error.ejs', { err });
});


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`App is listening on port ${PORT}`);
});