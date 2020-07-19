//import mysql from "mysql";
var mysql = require("mysql");
var util = require("util");

//import util from "util";

const conn = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "Artm@y08",
  database: "nodemysql",
});

// connect to database
conn.connect((err) => {
  if (err) {
    console.log("Error connecting to Db:" + err);
    return;
  }
  console.log("Connection established");
});

const query = util.promisify(conn.query).bind(conn);
module.exports = query;
//export { query };
//export default conn;
