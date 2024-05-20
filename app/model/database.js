let mysql = require("mysql2/promise");

const DB = mysql.createPool({
    host: "localhost",
    user: "superadmin@gmail.com", // Ensure this matches the correct database user
    password: "admin",
    database: "hospital_inventory",
    waitForConnections: true,
});

module.exports = DB;

