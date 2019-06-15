var driveService = require('./drive');
var photosService = require('./photos');

/**
 * Service and controller for handling core functions
 */
exports.exportPhotos = (session, folderId, albumName, callback) => {

    var oauth2Client = session.oauth2Client;

    photosService.createAlbum(oauth2Client, albumName).then((data)=>{
        var albumId = data.id;

        driveService.getFilesFromFolder(oauth2Client, folderId, (err, files) => {
            if (files.length != 0) {
                session.transactionStatus = {};
                session.transactionStatus.status = 'started';
                session.transactionStatus.files = files;
                session.save();
    
                //Push files one after another
                pushFile(files, session, oauth2Client, 0, albumId);
            } else {
                session.transactionStatus = {};
                session.transactionStatus.status = 'completed';
                session.transactionStatus.files = [];
                session.save();
            }
        });
    });

    callback('INITIATED');
}

/**
 * Function called recursively to queue file pushing one after the other.
 * 
 * @param {*} files 
 * @param {*} session 
 * @param {*} oauth2Client 
 * @param {*} index 
 * @param {*} albumId 
 * @param {*} userEmail 
 */
function pushFile(files, session, oauth2Client, index, albumId) {
    var file = files[index];
    driveService.getFile(oauth2Client, file.id, (content) => {

        //Push the image to Photos
        photosService.postFileToPhotos(oauth2Client, content, file.name, file.mimeType, albumId, (message) => {

            //Mark the file as completed
            session.transactionStatus.files[index].isCompleted = true;
            session.save();

            // Check if more files are pending for pushing and act accordingly.
            if (index + 1 < files.length) {
                pushFile(files, session, oauth2Client, index + 1, albumId)
            } else {
                session.transactionStatus.status = 'completed';
                session.save();
            }
        });
    });
}

