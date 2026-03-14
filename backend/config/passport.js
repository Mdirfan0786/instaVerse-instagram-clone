import dotenv from "dotenv";
dotenv.config();

import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import User from "../models/user.model.js";

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({
          $or: [
            { googleId: profile.id },
            { email: profile.emails?.[0]?.value },
          ],
        });

        if (!user) {
          const baseUsername = profile.displayName
            .replace(/\s/g, "")
            .toLowerCase();

          let username;
          let exists = true;

          while (exists) {
            username = baseUsername + Math.floor(Math.random() * 10000);
            const check = await User.findOne({ username });
            if (!check) exists = false;
          }

          user = await User.create({
            name: profile.displayName,
            username,
            email: profile.emails?.[0]?.value,
            googleId: profile.id,
            profilePic: profile.photos?.[0]?.value,
          });
        }

        done(null, user);
      } catch (err) {
        done(err, null);
      }
    },
  ),
);
