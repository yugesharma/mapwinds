const express = require('express');
const router = express.Router();
const openWeatherController = require("../controllers/openWeatherController")
const apiDBController = require("../controllers/apiDBController")
const changeDateController = require("../controllers/changeDateController")

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get("/openWeather", openWeatherController.openWeather);

router.get("/apiDB", apiDBController.apiDB);

router.get("/changeDate", changeDateController.changeDate);

router.get("/test", apiDBController.test);



module.exports = router;
