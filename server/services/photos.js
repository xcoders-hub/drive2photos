var Picasa = require('picasa');
var picasa = new Picasa();

/**
 * Service and controller for handling Google Photos related services
 */

exports.getAlbums = (oauth2Client, callback) => {
    var options = {};
    picasa.getAlbums(oauth2Client.credentials.access_token, options, (error, albums) => {
        callback(albums);
    })
}

/**
 * Posts the provided content as image to Google Photos
 */
exports.postFileToPhotos = (oauth2Client, content, name, mimeType, albumId, callback) => {

    var photoData = {
        title: name,
        summary: name,
        contentType: mimeType,
        binary: content
    };

    picasa.postPhoto(oauth2Client.credentials.access_token, albumId, photoData, (error, response) => {
        callback('File ' + name + ' uploaded successfully!');
    });
}