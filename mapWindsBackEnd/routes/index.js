const express = require('express');
const session = require('express-session');
const router = express.Router();
const auth=require('../auth')
const openWeatherController = require("../controllers/openWeatherController")
const apiDBController = require("../controllers/apiDBController")
const changeDateController = require("../controllers/changeDateController");
const passport = require('passport');

router.use(session({secret: "cats"}));
router.use(passport.initialize());
router.use(passport.session());

router.use(function(req, res, next) {
  res.locals.user = req.user; 
  next();
});

function isLoggedIn(req, res, next) {
  req.user ? next() : res.sendStatus(401);
}

// GET home page
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/protected', function(req, res, next) {
  console.log(req.user.displayName);
  res.render('index', {user:req.user.displayName});
});

router.get("/openWeather", openWeatherController.openWeather);

router.get("/apiDB", apiDBController.apiDB);

router.get("/changeDate", changeDateController.changeDate);

router.get("/auth/google", 
  passport.authenticate('google', {scope: ['email', 'profile']})
  );

router.get("/google/callback", 
  passport.authenticate('google', {
    successRedirect: "/protected",
    failureRedirect:"/auth/failure",
    session: true
  })
);

  // router.get("/protected", isLoggedIn, (req, res) => {
  //   res.send(`Hello ${req.user.displayName}`);
  // })

  router.get('/auth/failure', (req, res) => {
    res.send("logged failed");
  });

router.get('/logout', (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });

});



module.exports = router;
