'use strict';

const express = require('express'),
    app = express(),
    cors = require('cors'),
    bodyParser = require('body-parser');

app.use(cors());
app.use(express.urlencoded({extended: true}));
app.use(bodyParser());

require('dotenv').config({ path: '.env' });

require('./registerRoutes')(app);

module.exports = app;