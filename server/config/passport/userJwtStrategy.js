import passport from 'passport';
import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
import dotenv from 'dotenv';
import Users from '../../model/userModel.js';

dotenv.config();

// Validate JWT_SECRET
if (!process.env.ACCESS_TOKEN_SECRET) {
  throw new Error(
    'JWT_SECRET environment variable is required but not defined. Please add it to your .env file.'
  );
}

const opts = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.ACCESS_TOKEN_SECRET,
};

passport.use(
  new JwtStrategy(opts, async (jwt_payload, done) => {
    try {
      const user = await Users.findById(jwt_payload.id);

      if (user) {
        return done(null, user);
      } else {
        return done(null, false);
      }
    } catch (err) {
      return done(err, false);
    }
  })
);