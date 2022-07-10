const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

// Further info on unique
// https://stackoverflow.com/a/62367059
// https://mongoosejs.com/docs/validation.html#the-unique-option-is-not-a-validator
// https://mongoosejs.com/docs/faq.html#unique-doesnt-work
const UserSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true // NOT a validator, Mongoose doesn't handle unique on its own. It creates a MongoDB unique index
  }
});

// this plugin add username, hashedPassword, salt fields
// It also make sures username is unique + additional methods
UserSchema.plugin(passportLocalMongoose);

// Handling unique email error
UserSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoServerError' && error.code === 11000 && error.keyValue.email) {
    next(new Error('Email address was already taken, please choose a different one.'));
  } else {
    next(error);
  }
});

module.exports = mongoose.model('User', UserSchema);
