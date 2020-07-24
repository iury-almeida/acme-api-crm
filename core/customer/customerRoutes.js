'use strict';

const customerController = require('./customerController');

module.exports = (app) => {
    app.post('/customer', customerController.create);
    app.put('/customer/:id', customerController.update);
    app.get('/customer', customerController.select);
    app.get('/customer/:id', customerController.selectById);
    app.get('/ping', (req, res) => {
        res.send(new Date());
    });
}