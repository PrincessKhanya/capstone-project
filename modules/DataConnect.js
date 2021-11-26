const mysql = require("mysql");

module.exports.NewConnection = function () {
  let con = mysql.createConnection({
    host: process.env.DB_SERVER,
    user: process.env.DB_USER,
    database: process.env.DB_DATABASE,
    password: process.env.DB_PASSWORD,
  });

  return con;
};
