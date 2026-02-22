import passport from "passport";

import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from "passport-facebook";
import { User } from "../../../Models/Client/User.js";
import bcrypt from "bcrypt";

const serverBaseUrl = process.env.SERVER_BASE_URL || "http://localhost:5000";
const googleCallbackUrl =
  process.env.GOOGLE_CALLBACK_URL || `${serverBaseUrl}/api/v1/oAuth/auth/google/callback`;
const facebookCallbackUrl =
  process.env.FACEBOOK_CALLBACK_URL || `${serverBaseUrl}/api/v1/oAuth/auth/facebook/callback`;

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
      callbackURL: googleCallbackUrl,
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({ googleId: profile.id });

      ///merge user if already exist
      if (!user && profile.emails?.[0].value) {
        user = await User.findOne({ email: profile.emails?.[0].value });
        if (user && !user.googleId) {
          user.googleId = profile.id;
          await user.save();
        }
      }
      if (!user) {
        //create user in database
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          googleId: profile.id,
          passwordHash: await bcrypt.hash(process.env.RANDOM_PASSWORD + profile.id, 12),
        });
      }
      done(null, user);
    },
  ),
);

// Facebook OAuth
passport.use(
  new FacebookStrategy(
    {
      clientID: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
      callbackURL: facebookCallbackUrl,
      profileFields: ["id", "emails", "name", "displayName"],
    },
    async (_, __, profile, done) => {
      let user = await User.findOne({ facebookId: profile.id });

      //merge user if already exist
      if (!user && profile.emails?.[0].value) {
        user = await User.findOne({ email: profile.emails?.[0].value });
        if (user && !user.facebookId) {
          user.facebookId = profile.id;
          await user.save();
        }
      }

      if (!user) {
        user = await User.create({
          name: profile.displayName,
          email: profile.emails?.[0].value,
          facebookId: profile.id,
          passwordHash: await bcrypt.hash(process.env.RANDOM_PASSWORD + profile.id, 12),
        });
      }
      done(null, user);
    },
  ),
);
