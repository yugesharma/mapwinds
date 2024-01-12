const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');

exports.changeDate=asyncHandler(async (req, res, next) => {
    const date = req.query.date;
    if (date===null) {
        const err = new Error("date not received");
        err.status=404;
        return next(err);
    }
        res.send(date);
})

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test controller');
})

