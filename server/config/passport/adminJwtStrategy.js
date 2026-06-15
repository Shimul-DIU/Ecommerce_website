const passport = require('passport');
const Admin = require('../../model/adminModel');
const JwtStrategy = require('passport-jwt').Strategy;
const ExtractJwt = require('passport-jwt').ExtractJwt;
require('dotenv').config();

if (!process.env.ADMIN_JWT_SECRET) {
    throw new Error('ADMIN_JWT_SECRET environment variable is required but not defined. Please add it to your .env file.');
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ADMIN_JWT_SECRET,
};

passport.use(
  'admin-jwt',
  new JwtStrategy(opts, async function (jwt_payload, done) {
    try {
      const admin = await Admin.findOne({ _id: jwt_payload.id });
      if (admin) {
        return done(null, admin);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);