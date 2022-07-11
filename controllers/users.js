const User = require('../models/user');


// Register page
module.exports.renderRegisterForm = (req, res) => {
  res.render('users/register.ejs');
};

// Register create
module.exports.register = async (req, res, next) => {
  try {
    const { email, username, password } = req.body;
    const user = new User({ email, username });
    const registeredUser = await User.register(user, password); // check User validity & hash pw

    // Log user in after they're registered
    req.login(registeredUser, err => {
      if (err) {
        return next(err);
      }

      req.flash('success', 'Welcome to Yelp Camp!');
      res.redirect('/campgrounds');
    });
  } catch(e) {
    req.flash('error', e.message);
    res.redirect('/register');
  }
};

// Login page
module.exports.renderLoginForm = (req, res) => {
  if (req.user) {
    req.flash('success', `Already logged in as ${req.user.username}`);
    const redirectUrl = req.session.returnTo || '/campgrounds';
    delete req.session.returnTo;

    return res.redirect(redirectUrl);
  }
  res.render('users/login.ejs');
};

// Login submit
module.exports.loginRedirect = (req, res) => {
  const { username } = req.body;
  const redirectUrl = req.session.returnTo || '/campgrounds';
  delete req.session.returnTo;

  req.flash('success', 'Welcome back,', `${username}`);
  res.redirect(redirectUrl);
};

// Logout submit
module.exports.logout = (req, res) => {
  req.logout(function(err) {
    if (err) {
      return next(err);
    }

    req.flash('success', 'Goodbye!');
    res.redirect('/campgrounds');
  });
};
