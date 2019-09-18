const passportJWT = require('passport-jwt');
const JWTStrategy = passportJWT.Strategy;
const ExtractJWT = passportJWT.ExtractJwt;
const passport = require('passport');
const config = require('./server/config/config.js');
const User = require('./server/models').User;

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: config['jwt-secret']
}, function (jwtPayload, done) {
  return User.findOne({where: {id: jwtPayload.id}})
    .then(user => {
      if (!user) {
        return done(null, false);
      }
      return done(null, user)
    })
    .catch(err => {
      return done(err)
    })
}));