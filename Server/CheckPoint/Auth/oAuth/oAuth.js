
import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../../../Models/Client/User.js";
import bcrypt from "bcrypt";


passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  const user = await User.findById(id);
  done(null, user);
});

// Google OAuth
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "http://localhost:5000/api/v1/oAuth/auth/google/callback",
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });
      if (!user) {
        //create user in database
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
          passwordHash: await bcrypt.hash(
            process.env.RANDOM_PASSWORD + profile.id,
            12,
          ),
        });
      }
      done(null, user);
    },
  ),
);

// Facebook OAuth ----- Its not working idk why?? if someone know please tell me how its work explain here
// Ans--->
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: "/auth/facebook/callback",
      profileFields: ["id", "emails", "name", "displayName"],
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({ facebookId: profile.id });
      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          facebookId: profile.id,
          passwordHash: await bcrypt.hash(
            process.env.RANDOM_PASSWORD + profile.id,
            12,
          ),
        });
      }
      done(null, user);
    },
  ),
);
