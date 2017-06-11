var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var config = require('../config');

/**
 * Contains services and rest mappings related to managing authorization with Google
 */



var oauth2Client = new OAuth2(config.oauth.clientId, config.oauth.clientSecret, config.oauth.callback);

google.options({
    auth: oauth2Client
});

var scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://picasaweb.google.com/data/'
];

var url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes
});

exports.getAuthUrl = () => {
    return url;
}

exports.setAuthCode = (code) => {
    oauth2Client.getToken(code, (err, tokens) => {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
        }
    });
}