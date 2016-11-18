'use strict'
/**
 * Created by acastillo on 11/10/16.
 */
const proxy = require('express-http-proxy');
var session = require('express-session');
const app = require('express')();
const _config = require('./config.json');

var bodyParser = require('body-parser');

app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);
app.use(session({secret: 'ssshhhhh'}));

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

var liveSession;

app.get('/',function(req,res){
    liveSession = req.session;
    //Session set when user Request our app via URL
    if(liveSession.email) {
        res.render(_config.login_redirect);
    }
    else {
        res.render(_config.login);
    }
});

app.use('/proxy', proxy(_config.api_server, {
    reqAsBuffer: true,
    decorateRequest: function(proxyReq, originalReq) {
        proxyReq.headers['Content-Type'] = 'application/json';
        proxyReq.headers['accept'] = 'application/json';
        //Avoid clients could fool my system
        if(proxyReq.path.indexOf('&group=')) {
            proxyReq.path.replace(/&group=/g, "&groupp=")
        }
        if(liveSession && liveSession.group)
            proxyReq.path+='&group='+liveSession.group;
        else
            proxyReq.path+='&group=guess';
        return proxyReq;
    },
    intercept: function(rsp, data, req, res, callback) {
        if(liveSession && liveSession.group) {
            data = JSON.parse(data.toString('utf8'));
            callback(null, JSON.stringify(data));
        }

        /*if(liveSession && liveSession.group && liveSession.group === "humboldt"){
            data = JSON.parse(data.toString('utf8'));
            callback(null, JSON.stringify(data));
        } else {
            callback(null,"Sorry, you are not a humboldt user");
        }*/

    }
}));

/*app.use('/login', proxy('http://i2d.humboldt.org.co', {
    intercept: function(rsp, data, req, res, callback) {
        console.log(rsp);
        //data = JSON.parse(data.toString('utf8'));
        callback(null, data);
    }
}));*/

app.post('/login/ceiba/login.do',function(req,res){
    liveSession = req.session;
    //In this we are assigning email to sess.email variable.
    //email comes from HTML page.
    if(req.body.email === "guess"){
        liveSession.group = "guess";
        res.end('Logged in as '+liveSession.group);
    }
    else{
        if (req.body.email.indexOf("@humboldt.org.co")>=0) {
            if (req.body.password === "123"){
                liveSession.group = "humboldt";
                liveSession.email=req.body.email;
                res.end('Logged in as '+liveSession.group);
            }
        }
    }

    res.end("login failed");
});

app.get('/logout',function(req,res){
    req.session.destroy(function(err) {
        if(err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });

});

app.listen(_config.port, function () {
    console.log('Example app listening on port 3000!')
});