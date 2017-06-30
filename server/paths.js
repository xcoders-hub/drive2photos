var authService = require('./services/auth');
var driveService = require('./services/drive');
var photosService = require('./services/photos');
var coreService = require('./services/core');

module.exports = (app) => {

    app.use((req, res, next) => {
        authService.replenishSession(req.session);
        next();
    });

    /**
    * Handles authenticate request. 
    */

    app.get('/authenticate', (req, res) => {
        res.redirect(authService.getAuthUrl(req.session.oauth2Client));
    });

    /**
     * Callback URL for OAuth2. Receives auth code and and fetches access and refresh token
     */
    app.get('/oauthcallback', (req, res) => {
        authService.setAuthCode(req.session.oauth2Client, req.query.code, () => {
            authService.refreshUserProfile(req.session, () => {
                res.redirect('/');
            });

        });

    });

    /**
     * Returns the list of folders under the root node. Alternatively, if folder_id is passed as a query parameter, 
     * the folders present under the particular folder will be returned.
     */
    app.get('/drive/folders', (req, res, next) => {
        driveService.getFolders(req.session.oauth2Client, req.query.folder_id, (err, resultArray) => {
            if (err) {
                res.status(500).send(err.message);
            } else {
                res.json(resultArray);
            }
        })

    });

    /**
     * Returns the list of photo albums present in the connected google account
     */
    app.get('/photos/albums', (req, res) => {
        photosService.getAlbums(req.session.oauth2Client, (albums) => {
            res.json(albums);
        })
    });

    /**
     * Initiates the export process and acknowledges asynchronously
     */
    app.post('/export', (req, res) => {

        if (req.body.folderId == null || req.body.albumId == null) {
            throw new Error('Invalid input received');
        }

        coreService.exportPhotos(req.session, req.body.folderId, req.body.albumId, (message) => {
            res.send(message);
        });
    });

    /**
     * Closes the session
     */
    app.post('/close', (req, res) => {
        //Clear the OAuth2Client
        authService.closeSession(req.session);

        //Clear the session
        req.session.destroy();

        res.send('Done');
    });

    /**
     * Get the auth user info
     */
    app.get('/auth', (req, res) => {
        if (req.session.user) {
            var resp = { "userName": req.session.user.userName, "userEmail": req.session.user.userEmail };
        }

        res.json(resp);
    });

    /**
     * Returns the transaction status of the current logged in user
     */
    app.get('/status', (req, res) => {
        res.json(req.session.transactionStatus);
    });
}