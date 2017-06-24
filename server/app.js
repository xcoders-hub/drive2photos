var express = require('express');
var bodyParser = require('body-parser')
var session = require('express-session');
var serviceHolder = require('./services/service.holder');

var app = express();
//Enabling session management
var sessionOptions = {
    secret: 'my-secret',
    cookie: {}
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

//Starting the server
var server = app.listen(3000, () => {
    console.log('Server started... Listening on port 3000...')
});

//Setting up socket service
console.log('Setting up socket...');
var socketService = require('./services/socket')(server);
serviceHolder.setService('socket', socketService);
console.log('Done...');