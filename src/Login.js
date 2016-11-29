'use strict'
/**
 * Created by acastillo on 11/18/16.
 */
const xml2js = require('xml2js');
const fs = require('fs');

class Login{
    constructor(filename){
        let  parser = new xml2js.Parser();
        let content = fs.readFileSync(filename).toString();
        var datatmp = {}
        parser.parseString(content, function (err, result) {
            if(!err)
                datatmp = result['users']['user'];
        });
        //Make a map {email:{password, rol, firstname, lastname, lastLogin}}
        this.users = {};
        datatmp.forEach(user => {
            this.users[user['$']['email']] = user['$'];
            this.users[user['$']['email']]['password'] = user['password'][0];
        });
    }

    dologin(credentials) {
        let username = credentials.email;
        let password = credentials.password;

        if(!username || username === 'guess') {
            return {group: 'guess'};
        } else {
            let user = this.users[username];
            if (!user) {
                return null;
            } else {
                if(user['password'] === password) {
                    if(username.indexOf('@humboldt.org.co') >= 0) {
                        let role = user['role'].toLowerCase();
                        if(role === 'admin') {
                            return {group: 'super'};
                        } else {
                            return {group: 'humboldt'};
                        }
                    } else {
                        return {group: 'guess'};
                    }
                } else {
                    return null;
                }
            }
        }
    }
};

module.exports = Login;
