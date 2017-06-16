var google = require('googleapis');
var driveService = require('./drive');
var Picasa = require('picasa');
var picasa = new Picasa();

/**
 * Service and controller for handling core functions
 */
exports.exportPhotos = (folderId, albumId, callback) => {
    driveService.getFilesFromFolder(folderId, (err, files) => {

        //For each file found
        files.forEach((value, index) => {

            //Fetch the image from Google Drive
            driveService.getFile(value.id, (content) => {

                //Push the image to Photos
                postFileToPhotos(content, value.name, value.mimeType, albumId, (message) => {
                    console.log(message);
                });
            });
        });
    });

    callback('Process Initiated');
}

/**
 * Posts the provided content as image to Google Photos
 * 
 * @param {*} content 
 * @param {*} name 
 * @param {*} mimeType 
 * @param {*} albumId 
 * @param {*} callback 
 */
function postFileToPhotos(content, name, mimeType, albumId, callback) {

    var photoData = {
        title: name,
        summary: name,
        contentType: mimeType,
        binary: content
    };

    picasa.postPhoto(google._options.auth.credentials.access_token, '6427779832084932385', photoData, (error, response) => {
        callback('File ' + name + ' uploaded successfully!');
    });
}