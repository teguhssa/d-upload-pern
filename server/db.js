const Pool = require("pg").Pool;

const pool = new Pool({
  user: "postgres",
  password: "masukpostgre",
  database: "upload",
  port: 5432,
});

module.exports = pool;
