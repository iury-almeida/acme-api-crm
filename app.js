'use strict';

const app = require('./config/server');

app.listen(process.env.PORT || process.env.APIPORT, () => {
    console.log('API is listening on port:', process.env.PORT || process.env.APIPORT);
});