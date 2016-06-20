const jwt = require('jwt-simple');
const User = require('../models/user')
const config = require('../config')

// function to generate token for user once their credential matched.
function tokenForUser(user){
  const timestamp = new Date().getTime();
  return jwt.encode({ sub: user.id, iat: timestamp }, config.secret_key);
}


// Sign-up process --
exports.signup = function(req, res, next){

  const email = req.body.email;
  const pwd = req.body.password;

  // check whether the email exist in current db
  User.findOne({email: email}, function(err, existUser){
    // return err
    if (err) return next(err);

    // make sure email and password is not empty
    if(!email || !pwd) return res.status(422).send({error: "Missing Information"});
    // return duplicate email exist if user with that email exist
    if (existUser) return res.status(422).send({ error: "Duplicates email exist, please choose another email."})

    const user = new User({
      email: email,
      password: pwd
    });

    user.save(function(err){
      if(err) return next(err);
      res.json({token: tokenForUser(user)});
    });

  });
}

// Sign-In process --
exports.signin = function(req, res, next){
    // user had authed, just need to generate token and give it to them.
    res.send({token: tokenForUser(req.user)})
}
