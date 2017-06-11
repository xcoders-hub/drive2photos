var authService = require('./services/google.auth');
var driveService = require('./services/drive');
var photosService = require('./services/photos');
var coreService = require('./services/core');

module.exports = (app) => {

    /**
    * Handles authenticate request. 
    */

    app.get('/authenticate', (req, res) => {
        res.redirect(authService.getAuthUrl());
    });

    /**
     * Callback URL for OAuth2. Receives auth code and and fetches access and refresh token
     */
    app.get('/oauthcallback', (req, res) => {
        authService.setAuthCode(req.query.code);
        res.redirect('/');
    });

    /**
     * Returns the list of folders under the root node. Alternatively, if folder_id is passed as a query parameter, 
     * the folders present under the particular folder will be returned.
     */
    app.get('/drive/folders', (req, res, next) => {
        driveService.getFolders(req.query.folder_id, (err, resultArray) => {
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
        photosService.getAlbums((albums) => {
            res.json(albums);
        })
    });

    app.post('/export', (req, res) => {
        coreService.exportPhotos(req.body.folderId, req.body.albumId);
    });
}