var google = require('googleapis');
var OAuth2 = google.auth.OAuth2;
var config = require('../config');
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
 * Refreshes the session from the session store. The default session store of express is somehow not working. 
 * So, the session information is temporarily being stored inmemory in a variable.
 */
exports.replenishSession = (session) => {

    //Check if session is already available based on id
    if (sessionStore[session.id] == null) {
        // If corresponding oauth2 client is not available, create a new one and store the same.
        sessionStore[session.id] = {};
        sessionStore[session.id].oauth2Client = new OAuth2(config.oauth.clientId, config.oauth.clientSecret, config.oauth.callback);
    }

    // In either cases, refresh the object to make sure it contains the prototype methods
    session.oauth2Client = sessionStore[session.id].oauth2Client;
    session.user = sessionStore[session.id].user;

}

/**
 * Clears the oauth2client object from the list of stored clients
 */
exports.closeSession = (session) => {
    delete sessionStore[session.id];
}

/**
 * 
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

            sessionStore[session.id].user = { "userName": userName, "userEmail": userEmail };

            callback();
        }
    })
}