'use strict';

module.exports = (app) => {
    app.get('/ping', (req, res) => {
        res.send(new Date());
    })
}