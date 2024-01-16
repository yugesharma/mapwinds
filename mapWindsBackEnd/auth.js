const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const clientId= '1039893218225-hit9kh7fnhi7hjpjt5k8utm84md7t6nq.apps.googleusercontent.com'; 
const clientSecret = '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';

passport.use(new GoogleStrategy({
    clientID: clientId ,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  function(request, accessToken, refreshToken, profile, done) {
      return done(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});