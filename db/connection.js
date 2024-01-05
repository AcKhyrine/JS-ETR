const mysql = require("mysql");
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "storysync"
})
connection.connect(function (err) {
    if (err) {
        console.error(err.message);
        return;
    }
    console.log("connected")
})
module.exports = connection;