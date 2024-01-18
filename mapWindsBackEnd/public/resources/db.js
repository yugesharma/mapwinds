const {Pool} = require('pg');

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'mapwind_users',
  password: 'afirstdb',
  port: 5432,
});


module.exports=pool;
