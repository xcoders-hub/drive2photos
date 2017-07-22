var google = require('googleapis');
var driveService = google.drive('v3');

/**
 * Service and controller for handling Google Drive related services
 */

exports.getFolders = (oauth2Client, folderId, callback) => {

    //Search in root folder by default
    var folderId = folderId || 'root';

    fetchFileListFromGoogle(oauth2Client, null, "mimeType='application/vnd.google-apps.folder' and '" + folderId + "' in parents", [], (err, resultArray) => {
        callback(err, resultArray);
    });
}
``

/**
 * 
 * Helper function to get the list of files from google.
 * 
 * @param {*} pageToken 
 * @param {*} query 
 * @param {*} resultArray 
 * @param {*} callback 
 */
function fetchFileListFromGoogle(oauth2Client, pageToken, query, resultArray, callback) {
    driveService.files.list({
        auth: oauth2Client,
        q: query,
        pageToken: pageToken
    }, (err, res) => {
        if (err) {
            callback(err);
        } else {

            //Add the array of files received to resultArray
            resultArray = resultArray.concat(res.files);

            //Keep Calling fetchFileList until we receive all the files if nextPageToken exists, else callback
            if (res.nextPageToken) {
                console.log("Page token", res.nextPageToken);
                fetchFileListFromGoogle(oauth2Client, res.nextPageToken, query, resultArray, callback);
            } else {
                callback(null, resultArray);
            }
        }
    });
}

/**
 * Accepts folder id and returns the list of files present the folder
 */
exports.getFilesFromFolder = (oauth2Client, folderId, callback) => {
    fetchFileListFromGoogle(oauth2Client, null, "'" + folderId + "' in parents and mimeType contains 'image/'", [], (err, resultArray) => {
        callback(err, resultArray);
    });
}

/**
 * Accepts file Id and returns the same
 */
exports.getFile = (oauth2Client, fileId, callback) => {
    var content;
    var stream = driveService.files.get({
        auth: oauth2Client,
        fileId: fileId,
        alt: 'media'
    }).on('end', function () {
        callback(content);
    }).on('error', function (err) {
        console.log('Error during download', err);
    });

    stream.on('data', (chunk) => {
        if (content) {
            content = Buffer.concat([content, chunk], content.length + chunk.length);
        } else {
            content = chunk;
        }
    })
}
