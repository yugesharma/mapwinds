const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');
const pool = require("../public/resources/db");


pool.connect();

exports.save=asyncHandler (async(req, res, next) => {
    const route = "routeString"
    const a='a';
    const b ='b';
    const c =3;
    try {
        await pool.query('INSERT INTO test (col1, col2, key) VALUES ($1, $2 $3)',
        [a, b, c])
        res.status(200).send('check');
    } catch (error) {
        console.log(error);
    }      
});

pool.end;

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test apiDBcontroller');
})

