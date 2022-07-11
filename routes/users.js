const express = require('express');
const router = express.Router();
const userController = require('../controllers/users');
const passport = require('passport');


// Register route
router.route('/register')
  .get(userController.renderRegisterForm)
  .post(userController.register);

// Login route
router.route('/login')
  .get(userController.renderLoginForm)
  .post(
    passport.authenticate('local', {  // function that log user in
      failureFlash: true, 
      failureRedirect: '/login',
      keepSessionInfo: true
  })
  , userController.loginRedirect // redirect back to user's previous page
);

// Logout route
router.get('/logout', userController.logout);


module.exports = router;