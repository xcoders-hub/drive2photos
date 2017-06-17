var app = angular.module('drive2photos', ['treeControl']);

app.controller('mainctrl', ['$scope', '$http', '$q', function ($scope, $http, $q) {
    $scope.folders = [];
    $scope.isAuthenticated = true;
    $scope.expandedNodes = [];
    $scope.selectedAlbum = '';
    $scope.selectedFolder = '';

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
            alert('Process Initiated.');
        }, function (error) {
            //TODO: Show a failure
        });
    }

    $scope.closeSession = function () {
        $http.post('/close').then(function () {
            $scope.isAuthenticated = false;
        });

    }
}]);