const Authentication = require('./controllers/authentication');
const passportService = require('./utils/passport');
const passport = require('passport');

const requireAuth = passport.authenticate('jwt', { session: false });
const requireSignin = passport.authenticate('local', {session: false});


module.exports = function(app){
  app.get('/', function(req, res){
    res.send({ message: 'This is the root directory of API server'})
  })

  app.post('/signin',requireSignin, Authentication.signin);
  app.post('/signup', Authentication.signup);

  // LIMITED ACCESS PATH
  app.get('/users', requireAuth, function(req, res){
    res.send({message: 'This is authenticated path ...'})
  })

}
