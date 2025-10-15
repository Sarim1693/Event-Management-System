const { Client } = require('pg');
require('dotenv').config();

const client = new Client({
    host: "localhost",
    user: "postgres",
    password: process.env.DB_PASS,
    port: 5432,
    database: "event"
});

client.connect()
    .then(() => console.log("Database Connected"))
    .catch(err => console.error("DB Connection Error:", err));

module.exports = client;
