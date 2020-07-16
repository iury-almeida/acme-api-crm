
'use strict';

const Client = require('pg').Client,
    cliente = new Client({
        user: process.env.DBUSER,
        host: process.env.DBHOST,
        database: process.env.DBDATABASE,
        password: process.env.DBPASSWORD,
        port: process.env.DBPORT || 5432
    });

module.exports = cliente;
