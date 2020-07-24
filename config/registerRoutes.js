'use strict';

const customerRoute = require('../core/customer/customerRoutes');

module.exports = (app) => {
    customerRoute(app);
}