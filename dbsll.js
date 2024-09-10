const Pool = require('pg').Pool
const pool = new Pool({
    user: "postgres",
    password: "TheBestForever8TheBestForever8",
    host: "localhost",
    port: 15370,
    database: "code"
})

module.exports = pool

