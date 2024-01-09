const express = require('express');
const router = express.Router();
const openWeatherController = require("../controllers/openWeatherController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/openWeather", openWeatherController.openWeather);

router.get("/test", openWeatherController.test);

module.exports = router;
