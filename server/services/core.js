var google = require('googleapis');
var driveService = require('./drive');
var photosService = require('./photos');
var serviceHolder = require('./service.holder')

/**
 * Service and controller for handling core functions
 */
exports.exportPhotos = (oauth2Client, folderId, albumId, userEmail, callback) => {

    var socketService = serviceHolder.getService('socket');

    driveService.getFilesFromFolder(oauth2Client, folderId, (err, files) => {

        //Send the list of files to the user
        socketService.update(userEmail, 'list_of_files', files);

        //For each file found
        files.forEach((value, index) => {

            //Fetch the image from Google Drive
            driveService.getFile(oauth2Client, value.id, (content) => {

                //Push the image to Photos
                photosService.postFileToPhotos(oauth2Client, content, value.name, value.mimeType, albumId, (message) => {
                    socketService.update(userEmail, 'completion', value.id);
                });
            });
        });
    });

    callback('Process Initiated');
}

