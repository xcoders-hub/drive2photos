var Picasa = require('picasa');
var google = require('googleapis');
var picasa = new Picasa();
var fs = require('fs');

/**
 * Service and controller for handling Google Photos related services
 */

exports.getAlbums = (callback) => {
    var options = {};
    picasa.getAlbums(google._options.auth.credentials.access_token, options, (error, albums) => {
        callback(albums);
    })
}


    // app.get('/photos/upload', function (req, res) {
    //     fs.readFile(__dirname + '/photos/T-Form.PNG', (err, binary) => {
    //         var photoData = {
    //             title: 'Jake the dog',
    //             summary: 'Corgis ftw!',
    //             contentType: 'image/png',
    //             binary: binary
    //         };

    //         picasa.postPhoto(google._options.auth.credentials.access_token, '6427779832084932385', photoData, (error, response) => {
    //             console.log(error, response)
    //         })
    //     })
    // })
