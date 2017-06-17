var express = require('express');
var app = express();
var bodyParser = require('body-parser')
var session = require('express-session');

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
