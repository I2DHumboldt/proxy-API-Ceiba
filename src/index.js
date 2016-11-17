'use strict'
/**
 * Created by acastillo on 11/10/16.
 */
const proxy = require('express-http-proxy');
var session = require('express-session');
const app = require('express')();

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
        res.render('index.html');
    }
    else {
        res.render('login.html');
    }
});

app.use('/proxy', proxy('http://localhost:5000', {
    reqAsBuffer: true,
    decorateRequest: function(proxyReq, originalReq) {
        proxyReq.headers['Content-Type'] = 'application/json';
        proxyReq.headers['accept'] = 'application/json';
        return proxyReq;
    },

    intercept: function(rsp, data, req, res, callback) {
        if(liveSession && liveSession.group && liveSession.group === "humboldt"){
            data = JSON.parse(data.toString('utf8'));
            callback(null, JSON.stringify(data));
        } else {
            callback(null,"Sorry, you are not a humboldt user");
        }

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
    console.log(req.body);
    if (req.body.password === "123"){
        console.log(req.body.email);
        console.log(req.body.email.indexOf("@humboldt.org.co"));
        if (req.body.email.indexOf("@humboldt.org.co")>=0) {
            liveSession.group = "humboldt";

        } else {
            liveSession.group = "guess";
        }
        liveSession.email=req.body.email;
        res.end('done as '+liveSession.group);
    }
    res.end("Failed to login");
});

app.listen(3000, function () {
    console.log('Example app listening on port 3000!')
});