const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt-nodejs');

// definining the model
const userSchema = new Schema({
  email: { type: String, unique: true, lowercase: true },
  password: String,
  name: String
})

// on save hook, encrypt password -- run before model get save
userSchema.pre('save', function(next){
  const user = this;

  // using bcrypt to encrypt the password - generate a salt
  bcrypt.genSalt(10, function(err, salt){

    if(err) {
      return next(err)
    };

    // hash password using the salt
    bcrypt.hash(user.password, salt, null, function(err, hash){
      if(err) { return next(err)}

      // overwrite password with its hash.
      user.password = hash;
      next();
    })
  })
});

// custom methods - comparing password for signing in
userSchema.methods.comparePassword = function(candidatePassword, callback){
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch){
    if(err) return callback(err);

    callback(null, isMatch);
  })
}

// create model class
const ModelClass = mongoose.model('user', userSchema);

// export model
module.exports = ModelClass;
