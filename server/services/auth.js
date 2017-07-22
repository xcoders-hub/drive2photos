var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var plusService = google.plus('v1');

/**
 * Contains services and rest mappings related to managing authorization with Google
 */

const scopes = [
    'email',
    'https://www.googleapis.com/auth/drive.readonly',
    'https://picasaweb.google.com/data/'
];

var sessionStore = {};

/** 
 * Check if config options are provided from environment, take the settings from environment 
 * or look in config.js
 */
var clientId;
var clientSecret;
var oauthCallback;

clientId = process.env.CLIENT_ID;
clientSecret = process.env.CLIENT_SECRET;
oauthCallback = process.env.OAUTH_CALLBACK;

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
 * Refreshes the session from the session store. Variables stored in session are serialized, so they will lose prototyping,
 * so storing the list of oauth2clients manually and replenishing them when needed.
 */
exports.replenishSession = (session) => {

    //Check if session is already available based on id
    if (sessionStore[session.id] == null) {
        // If corresponding oauth2 client is not available, create a new one and store the same.
        sessionStore[session.id] = {};
        sessionStore[session.id].oauth2Client = new OAuth2(clientId, clientSecret, oauthCallback);
    }

    // // In either cases, refresh the object to make sure it contains the prototype methods
    session.oauth2Client = sessionStore[session.id].oauth2Client;
}

/**
 * Clears the oauth2client object from the list of stored clients
 */
exports.closeSession = (session) => {
    delete sessionStore[session.id];
}

/**
 * Updates the session variable with user's email and name details
 */
exports.refreshUserProfile = (session, callback) => {
    plusService.people.get({ 'userId': 'me', auth: session.oauth2Client }, (err, res) => {
        if (res) {
            var userName = res.displayName;
            var userEmail = '';

            res.emails.forEach((value) => {
                if (value.type == "account") {
                    userEmail = value.value;
                }
            });

            session.user = { "userName": userName, "userEmail": userEmail };

            callback();
        }
    });
}

