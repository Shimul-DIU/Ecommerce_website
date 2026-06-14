const JwtStrategy = require('passport-jwt').Strategy,
    ExtractJwt = require('passport-jwt').ExtractJwt;
const passport = require('passport');
require('dotenv').config();
const User=require('../../model/userModel')

// Validate JWT_SECRET
if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET environment variable is required but not defined. Please add it to your .env file.');
}

const opts = {}
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, async function(jwt_payload, done) {
    try {
        const user = await User.findOne({_id: jwt_payload.id});
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    } catch (err) {
        return done(err, false);
    }
}));