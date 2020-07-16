'use strict';

const testeRoute = require('../core/functionality/routes');
const customerRoute = require('../core/customer/customerRoutes');

module.exports = (app) => {
    testeRoute(app);
    customerRoute(app);
}