const express = require('express');
const router = express.Router();
const openWeatherController = require("../controllers/openWeatherController")
const apiDBController = require("../controllers/apiDBController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/openWeather", openWeatherController.openWeather);

router.get("/test", apiDBController.test);

router.get("/apiDB", apiDBController.apiDB);

module.exports = router;
