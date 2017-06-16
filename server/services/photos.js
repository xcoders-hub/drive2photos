var Picasa = require('picasa');
var google = require('googleapis');
var picasa = new Picasa();

/**
 * Service and controller for handling Google Photos related services
 */

exports.getAlbums = (callback) => {
    var options = {};
    picasa.getAlbums(google._options.auth.credentials.access_token, options, (error, albums) => {
        callback(albums);
    })
}

