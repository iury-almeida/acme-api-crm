'use strict';

const express = require('express'),
    app = express(),
    cors = require('cors');

app.use(cors());

require('dotenv').config({ path: '.env' });

require('./registerRoutes')(app);

module.exports = app;