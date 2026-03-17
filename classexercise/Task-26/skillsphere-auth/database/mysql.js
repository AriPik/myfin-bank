const mysql = require("mysql2");

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "ArijitDas@2003$56",
  database: "skillsphere"
});

connection.connect(err => {
  if (err) throw err;
  console.log("MySQL Connected");
});

module.exports = connection;