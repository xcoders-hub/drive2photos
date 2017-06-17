var google = require('googleapis');
var driveService = require('./drive');
var photosService = require('./photos');

/**
 * Service and controller for handling core functions
 */
exports.exportPhotos = (oauth2Client, folderId, albumId, callback) => {
    driveService.getFilesFromFolder(oauth2Client, folderId, (err, files) => {

        //For each file found
        files.forEach((value, index) => {

            //Fetch the image from Google Drive
            driveService.getFile(oauth2Client, value.id, (content) => {

                //Push the image to Photos
                photosService.postFileToPhotos(oauth2Client, content, value.name, value.mimeType, albumId, (message) => {
                    console.log(message);
                });
            });
        });
    });

    callback('Process Initiated');
}

