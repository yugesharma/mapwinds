const express = require('express');
const session = require('express-session');
const router = express.Router();
const auth=require('../auth')
const openWeatherController = require("../controllers/openWeatherController")
const apiDBController = require("../controllers/apiDBController")
const changeDateController = require("../controllers/changeDateController");
const routeController = require("../controllers/routeController");
const pool = require("../public/resources/db");


pool.connect();

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


  router.get('/auth/failure', (req, res) => {
    res.send("logged failed");
  });

router.get('/logout', (req, res) => {
  req.logout(req.user, err => {
    if(err) return next(err);
    res.redirect("/");
  });

});

router.post('/route/save', isLoggedIn, (async(req, res, next) => {
    
  await pool.query("INSERT INTO routes (route, author_id) VALUES ($1, $2)",
  [req.body.post, req.user.id])
  res.status(200).send();      
}));


module.exports = router;
