var google = require('googleapis');
var driveService = google.drive('v3');

/**
 * Service and controller for handling Google Drive related services
 */

exports.getFolders = (folderId, callback) => {

    //Search in root folder by default
    var folderId = folderId || 'root';

    fetchFileListFromGoogle(null, "mimeType='application/vnd.google-apps.folder' and '" + folderId + "' in parents", [], (err, resultArray) => {
        callback(err, resultArray);
    });
}


/**
 * 
 * Helper function to get the list of files from google.
 * 
 * @param {*} pageToken 
 * @param {*} query 
 * @param {*} resultArray 
 * @param {*} callback 
 */
function fetchFileListFromGoogle(pageToken, query, resultArray, callback) {
    driveService.files.list({
        q: query,
        spaces: 'drive',
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
                fetchFileListFromGoogle(res.nextPageToken, query, parents, resultArray, callback);
            } else {
                callback(null, resultArray);
            }
        }
    });
}
