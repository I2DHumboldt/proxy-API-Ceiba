'use strict'
/**
 * Created by acastillo on 11/10/16.
 */
const proxy = require('express-http-proxy');
const session = require('express-session');
const app = require('express')();
const _config = require('./config.json');
const bodyParser = require('body-parser');


app.set('views', __dirname + '/views');
app.engine('html', require('ejs').renderFile);

let sess = {
    secret: 'not really secret, change me!!',//Change this secret in produccion
    proxy: true,
    resave: true,
    saveUninitialized: true,
    cookie: {}
}
if (app.get('env') === 'production') {
    app.set('trust proxy', 1) // trust first proxy
    sess.cookie.secure = true // serve secure cookies
}
app.use(session(sess));

app.use(bodyParser.json());       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

const loginApp = new (require('./Login'))(_config.login_users);

var liveSession = {group: "guess"};

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
        if(proxyReq.path.indexOf('&group=') >= 0) {
            proxyReq.path = proxyReq.path.replace(/\&group=/g, "&groupp=")
        }
        if(liveSession && liveSession.group)
            proxyReq.path+='&group='+liveSession.group;
        else
            proxyReq.path+='&group=guess';
        return proxyReq;
    }
}));

app.post('/login',function(req,res){
    liveSession = req.session;
    let auth = loginApp.dologin(req.body);
    if(auth) {
        liveSession.group = auth.group;
        res.end(JSON.stringify(auth));
    }
    else{
        res.end("login failed");
    }
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
    console.log('Proxy running port '+_config.port+" !");
});