'use strict'
/**
 * Created by acastillo on 11/18/16.
 */
const _config = require('../config.json');
const loginApp = new (require('../Login'))(_config.login_users);

const bodyEmpty = {};
const bodyGuess = {email: "guess"};
const bodyBadCredentials = {email: "user@gmail.com", password:"wrongpass"};
const bodyNoHumboldt = {email: "user@gmail.com", password:"goodpass"};
const bodyHumboldt = {email: "humboldt@humboldt.org.co", password:"goodpass"};
const bodyAdmin = {email: "humboldtadmin@humboldt.org.co", password:"goodpass"};

const should = require("should");

describe('Login', function () {
    it('Login without credentials should return guess', function () {
        var auth = loginApp.dologin(bodyEmpty);
        auth.should.eql({group:"guess"});
    });
    it('Login with email = guess should return guess', function () {
        var auth = loginApp.dologin(bodyGuess);
        auth.should.eql({group:"guess"});
    });
    it('Login with bad credentials should return null', function () {
        var auth = loginApp.dologin(bodyBadCredentials);
        should.equal(auth, null);
    });
    it('Login with credentials no humboldt should return guess', function () {
        var auth = loginApp.dologin(bodyNoHumboldt);
        auth.should.eql({group:"guess"});
    });
    it('Login with credentials humboldt and role different than Admin should return humboldt', function () {
        var auth = loginApp.dologin(bodyHumboldt);
        auth.should.eql({group:"humboldt"});
    });
    it('Login with credentials humboldt and role Admin should return super', function () {
        var auth = loginApp.dologin(bodyAdmin);
        auth.should.eql({group:"super"});
    });
});

