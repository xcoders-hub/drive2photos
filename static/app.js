var app = angular.module('drive2photos', ['treeControl']);

app.controller('mainctrl', ['$scope', '$http', '$q', '$timeout', function ($scope, $http, $q, $timeout) {
    $scope.folders = [];
    $scope.isAuthenticated = true;
    $scope.expandedNodes = [];
    $scope.selectedAlbum = '';
    $scope.selectedFolder = '';
    $scope.userInfo = {};
    var socket;

    $scope.getFolders = function (folderId) {
        var deferred = $q.defer();

        var query = '';
        if (folderId) {
            query = '?folder_id=' + folderId;
        }

        $http.get('/drive/folders' + query).then(function (data) {
            var folders = [];
            angular.forEach(data.data, function (v, i) {
                folders.push({
                    "folderName": v.name,
                    "folderId": v.id
                });
            });
            deferred.resolve(folders);
        }, function (error) {
            deferred.reject(error.data);
        });


        return deferred.promise;
    }

    $scope.folderSelected = function (node) {
        $scope.getFolders(node.folderId).then(function (data) {
            node.children = data;
        }, function (error) {

        });
        $scope.expandedNodes.push(node);
        $scope.selectedFolder = node.folderId;
    };

    $scope.getFolders().then(function (data) {
        $scope.folders = data;
    }, function (error) {
        if (error == "No access or refresh token is set.") {
            $scope.isAuthenticated = false;
        }
    });

    $scope.getAlbums = function () {
        $http.get('/photos/albums').then(function (data) {
            $scope.albums = data.data;
        }, function (error) {

        });
    }

    $scope.movePhotos = function () {
        var body = {
            folderId: $scope.selectedFolder,
            albumId: $scope.selectedAlbum
        };

        $http.post('/export', body).then(function (response) {
            $scope.processInitiated = true;
        }, function (error) {
            //TODO: Show a failure
        });
    }

    $scope.closeSession = function () {
        $http.post('/close').then(function () {
            $scope.isAuthenticated = false;
        });
    }

    $scope.getUserInfo = function () {
        $http.get('/auth').then(function (data) {
            $scope.userInfo = data.data;
            createSocket();
        }, function (error) {

        });
    }

    $scope.getUserInfo();

    function createSocket() {
        socket = io('/');

        socket.on('connect', function () {
            socket.emit('registerUser', { userEmail: $scope.userInfo.userEmail });
        });

        socket.on('list_of_files', function (data) {
            $timeout(function () {
                $scope.fileList = data;
            });

        });

        socket.on('completion', function (data) {
            $timeout(function () {
                $scope.fileList.forEach(function (v, i) {
                    if (v.id == data) {
                        v.status = 'COMPLETED';
                    }
                });
            });
        });
    }
}]);