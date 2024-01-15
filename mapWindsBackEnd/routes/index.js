const express = require('express');
const router = express.Router();
const auth=require('../auth')
const openWeatherController = require("../controllers/openWeatherController")
const apiDBController = require("../controllers/apiDBController")
const changeDateController = require("../controllers/changeDateController");
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/openWeather", openWeatherController.openWeather);

router.get("/apiDB", apiDBController.apiDB);

router.get("/changeDate", changeDateController.changeDate);

router.get("/auth/google", 
  passport.authenticate('google', {scope: ['email', 'profile']})
  );

router.get("/google/callback", (req, res) => {
  res.redirect("/");
  
})



module.exports = router;
