const Pool = require('pg').Pool
require("dotenv").config()

var dbConfig

if (process.env.NODE_ENV === "production") {
    // configuration for remote database (Heroku Postgres)
    dbConfig = {
        connectionString: process.env.DATABASE_URL,
        ssl: {
            rejectUnauthorized: false
        }
    }
} else {
    // configuration for local database; using variables from .env file
    dbConfig = {
        user : process.env.PG_USER,
        password: process.env.PG_PASSWORD,
        host: process.env.PG_HOST,
        port: process.env.PG_PORT,
        database: process.env.PG_DATABASE
    }
    
    // dbConfig = `postgresql://${process.env.PG_USER}:${process.env.PG_PASSWORD}@${process.env.PG_HOST}:${process.env.PG_PORT}/${process.env.PG_DATABASE}`;
}

const pool = new Pool(dbConfig)


module.exports = pool