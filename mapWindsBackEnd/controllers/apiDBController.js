const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');

const {Pool} = require('pg');
const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mapwinds2',
  password: 'afirstdb',
  port: 5432,
});

pool.connect();

exports.apiDB=asyncHandler(async (req, res, next) => {
     const date = req.query.date;
     pool.query(`SELECT * from mapwinder where time like '${date}%' LIMIT 5`, (error, res) => {
        if (error) {
            return next(error);
        }
        console.log(res.rows);
        // res.status(200).json(results.rows)
     })
    // const response= await fetch(apiUrl);
    // const data= await response.json();
})

pool.end;

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test apiDBcontroller');
})

