'use strict'
/**
 * Created by acastillo on 11/10/16.
 */
const proxy = require('express-http-proxy');
const app = require('express')();

app.use('/proxy', proxy('http://localhost:5000', {
    intercept: function(rsp, data, req, res, callback) {
        data = JSON.parse(data.toString('utf8'));
        callback(null,JSON.stringify(data));
    }
}));

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});