const passport = require('passport');
const User = require('../models/user');
const config = require('../config');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
const LocalStrategy = require('passport-local');
const bcrypt = require('bcrypt-nodejs');

// Local Strategy
const localOptions = {
  usernameField: 'email'
};
const localLogin = new LocalStrategy(localOptions, function(email, password, done){
  // verify username and password, if correct pass user object to done else pass false to done
  User.findOne({email: email}, function(err, user){
    if(err) return done(err);
    if(!user) return done(null, false);
    // check user hashed password using bcrypt - comparing hash between user provided pasword vs stored hashed password
    user.comparePassword(password, function(err, isMatch){
      if(err) return done(err);
      if(!isMatch) return done(null, false)

      done(null, user)
    })

  })
})


// setup options for JWT Strategy
const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromHeader('authorization'),
  secretOrKey: config.secret_key
}

// create JWT Strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done){
  // check user exist in db, if it is return done with user object, else return done without user object
  User.findById(payload.sub, function(err, user){
    if(err) return done(err, false);
    if(user) {
      done(null, user)
    }
    else{
      done(null, false)
    }

  })
});

// tell passport to use this Strategy
passport.use(jwtLogin);
passport.use(localLogin);
