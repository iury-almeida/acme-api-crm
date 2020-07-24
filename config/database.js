
'use strict';

const Pool = require('pg').Pool,
    pool = new Pool({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBDATABASE,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT || 5432
    });

module.exports = pool;
