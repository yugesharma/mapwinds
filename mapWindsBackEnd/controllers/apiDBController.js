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
     const result=await pool.query(`SELECT * from mapwinder where  index%4=0 and time like '${date}%' `)  
     res.status(200).json(result.rows);
     })

pool.end;

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test apiDBcontroller');
})

