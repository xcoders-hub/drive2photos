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
        if (files.length == 0) {
            socketService.update(userEmail, 'no_files');
            socketService.disconnect(userEmail);
        }

        //Send the list of files to the user
        socketService.update(userEmail, 'list_of_files', files);

        //Push files one after another
        pushFile(files, oauth2Client, 0, albumId, socketService, userEmail);
    });

    callback('INITIATED');


}

function pushFile(files, oauth2Client, index, albumId, socketService, userEmail) {
    var file = files[index];
    driveService.getFile(oauth2Client, file.id, (content) => {

        //Push the image to Photos
        photosService.postFileToPhotos(oauth2Client, content, file.name, file.mimeType, albumId, (message) => {
            socketService.update(userEmail, 'completion', file.id);

            if (index + 1 < files.length) {
                pushFile(files, oauth2Client, index + 1, albumId, socketService, userEmail)
            } else {
                socketService.update(userEmail, 'all_files_done');
                socketService.disconnect(userEmail);
            }
        });
    });
}

