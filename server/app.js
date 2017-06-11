var express = require('express');
var app = express();
var bodyParser = require('body-parser')

app.use(express.static('static'));
app.use(bodyParser.json());

app.use('/lib', express.static('bower_components'));

console.log('Setting up paths...');
require('./paths')(app);
console.log('Done...');

var server = app.listen(3000, () => {
    console.log('Server started... Listening on port 3000...')
});
