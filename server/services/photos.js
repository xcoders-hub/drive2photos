const Photos = require('googlephotos');
const request = require('request-promise');


/**
 * Posts the provided content as image to Google Photos
 */
exports.postFileToPhotos = (oauth2Client, content, name, mimeType, albumId, callback) => {
    const photos = new Photos(oauth2Client.credentials.access_token)
    request.post('https://photoslibrary.googleapis.com/v1/uploads',
        {
            headers: getHeadersForFileUpload(name),
            auth: { "bearer": oauth2Client.credentials.access_token },
            body: content
        }, (error, response) => {
            if (error == null) {
                var uploadToken = response.body;
                request.post('https://photoslibrary.googleapis.com/v1/mediaItems:batchCreate',
                    {
                        headers: { "Content-type": "application/json" },
                        auth: { "bearer": oauth2Client.credentials.access_token },
                        body: JSON.stringify({
                            "albumId": albumId,
                            "newMediaItems": [
                                {
                                    "description": name,
                                    "simpleMediaItem": {
                                        "uploadToken": uploadToken
                                    }
                                }
                            ]
                        })
                    }, (error, data)=>{console.log(data.body)
                        callback('File ' + name + ' uploaded successfully!');
                    });
            }
        });

    // picasa.postPhoto(oauth2Client.credentials.access_token, albumId, photoData, (error, response) => {
    //     callback('File ' + name + ' uploaded successfully!');
    // });
}

getHeadersForFileUpload = (fileName) => {
    return {
        "Content-type": "application/octet-stream",
        "X-Goog-Upload-File-Name": fileName,
        "X-Goog-Upload-Protocol": "raw"

    }
}

exports.createAlbum = (oauth2Client, albumName) => {
    var photos = new Photos(oauth2Client.credentials.access_token);

    return photos.albums.create(albumName);
}