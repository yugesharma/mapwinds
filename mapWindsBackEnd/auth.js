const passport = require('passport');
const GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
const clientId= '1039893218225-hit9kh7fnhi7hjpjt5k8utm84md7t6nq.apps.googleusercontent.com'; 
const clientSecret = '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';
const pool = require("./public/resources/db");

passport.use(new GoogleStrategy({
    clientID: clientId ,
    clientSecret: clientSecret,
    callbackURL: "http://localhost:3000/google/callback",
    passReqToCallback   : true
  },
  async (request, accessToken, refreshToken, profile, done) => {
      const account = profile._json;
      let user = {};
      console.log(account);
      try {
        const currentUserQuery=await pool.query("SELECT * FROM users WHERE google_id=$1", [account.sub]);
        if(currentUserQuery.rows.length === 0) {
            await pool.query("INSERT INTO users(username, img, google_id) VALUES ($1, $2, $3)",
             [account.name, account.picture, account.sub]);

             const id = await pool.query("SELECT id FROM users WHERE google_id=$1", [account.sub]);
             user = {id: id.rows[0].id, username:account.name, img:account.picture};
        } else {
            user=  {id:currentUserQuery.rows[0],
                 username:currentUserQuery.rows[0].username,
                  img:currentUserQuery.rows[0].img};
        };
        done(null, user);
      } catch (error) {
        done(error)
      }
      
      //return done(null, profile);

  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});