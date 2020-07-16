'use strict';

const app = require('./config/server');

app.listen(process.env.PORT || 3000, () => {
    console.log('API is listening on port:', process.env.PORT || 3000);
});