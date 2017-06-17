var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var config = require('../config');

/**
 * Contains services and rest mappings related to managing authorization with Google
 */

const scopes = [
    'https://www.googleapis.com/auth/drive.readonly',
    'https://picasaweb.google.com/data/'
];

var oauth2Clients = {};

/**
 * Generates the OAuth2 request URL
 */
exports.getAuthUrl = (oauth2Client) => {
    var url = oauth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: scopes
    });
    return url;
}

/**
 * Fetches Access and Refresh tokens and save them to the oauth2Client
 */
exports.setAuthCode = (oauth2Client, code, callback) => {

    oauth2Client.getToken(code, (err, tokens) => {
        // Now tokens contains an access_token and an optional refresh_token. Save them.
        if (!err) {
            oauth2Client.setCredentials(tokens);
            callback('Done');
        }
    });
}

/**
 * Checks if an oauth2client is present for the current session and creates a new one if not found. 
 * The sessions are also stored separately in a JS Object as while saving objects to session, the prototypes are lost. 
 * So it is important to keep the original object saved.
 */
exports.initOAuth2Client = (session) => {

    // If corresponding oauth2 client is not available, create a new one and store the same.
    if (!oauth2Clients[session.id]) {
        oauth2Clients[session.id] = new OAuth2(config.oauth.clientId, config.oauth.clientSecret, config.oauth.callback);
    }

    // In either cases, refresh the object to make sure it contains the prototype methods
    session.oauth2Client = oauth2Clients[session.id];
}

/**
 * Clears the oauth2client object from the list of stored clients
 */
exports.closeSession = (session) => {
    delete oauth2Clients[session.id];
}