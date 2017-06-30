var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session');

var app = express();
//Enabling session management
var sessionOptions = {
    secret: 'my-secret',
    cookie: {
        path: '/',
        httpOnly: true
    },
    resave: true,
    saveUninitialized: true
};
app.use(session(sessionOptions));

//Enabling static file serving
app.use(express.static('static'));
app.use('/lib', express.static('bower_components'));

//Enabling HTTP Body parsing
app.use(bodyParser.json());

//Setting up paths
console.log('Setting up paths...');
require('./paths')(app);
console.log('Done...');

var port = process.env.PORT || 3000;

//Starting the server
var server = app.listen(port, () => {
    console.log('Server started... Listening on port: ' + port)
});
