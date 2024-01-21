const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');
const pool = require("../public/resources/db");


pool.connect();

exports.save=asyncHandler (async(req, res, next) => {
    
    await pool.query("INSERT INTO routes (route, author_id) VALUES ($1, $2)",
    [req.body.post, req.user.id])
    res.status(200).send();      
});

pool.end;

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test apiDBcontroller');
})

