const asyncHandler=require('express-async-handler');
const fetch = require('node-fetch');
const pool = require("../public/resources/db");


pool.connect();

exports.save=asyncHandler (async(req, res, next) => {
    await pool.query("INSERT INTO routes (routeName, route, author_id) VALUES ($1, $2, $3)",
    [req.body.routeName, req.body.route, req.user.id.id])
    res.status(200).send();      
  });

  exports.show=asyncHandler (async(req, res, next) => {
    const routes=await pool.query("SELECT routeName, route FROM routes WHERE author_id = $1 ",
    [req.user.id.id])
    res.json(routes);      
  });



pool.end;

exports.test = asyncHandler(async (req, res, next) => {
    res.send('generated from test apiDBcontroller');
})

