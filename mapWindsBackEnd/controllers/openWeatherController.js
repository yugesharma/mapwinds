const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');

exports.openWeather=asyncHandler(async (req, res, next) => {
    const {lat, lon} = req.query;
    const oapiKey = '5431cea4928259758e577c8cd26f641d';
    const apiUrl= `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${oapiKey}`
    const response= await fetch(apiUrl);
    const data= await response.json();

    if (data===null) {
        const err = new Error("data not received");
        err.status=404;
        return next(err);
    }
        res.json(data);
})

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test controller');
})

