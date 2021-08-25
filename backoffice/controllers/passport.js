const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/configSchema");
const bcrypt = require("bcrypt");

function initialize(passport) {
  passport.use(new LocalStrategy({
    usernameField: "email"
  },
    (user, password, done) => {
      User.findOne({ email: user }).then(async (user, err) => {
        if (err) return done(err)
        if (!user) {
          return done(null, false, { message: "No user with that email" });
        }
        try {
          if (! await bcrypt.compare(password, user.password)) {
            return done(null, false, { message: "Password incorrect" });
          } else {
            return done(null, user);
          }
        } catch (e) {
          return done(e);
        }
      });
    })
  );
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize;
