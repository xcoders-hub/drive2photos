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

    var checker;

    $scope.movePhotos = function () {
        var body = {
            folderId: $scope.selectedFolder,
            albumId: $scope.selectedAlbum
        };


        $http.post('/export', body).then(function (response) {
            $scope.processInitiated = true;
            checker = $timeout($scope.refreshStatus);
        }, function (error) {
            //TODO: Show a failure
        });
    }

    $scope.refreshStatus = function () {
        $http.get('/status').then(function (data) {
            if (data.data.status == 'started') {
                $scope.processInitiated = true;
            }

            $scope.fileList = data.data.files;

            if (data.data.status == 'completed') {
                $timeout.cancel(checker);
                $scope.processInitiated = $scope.processCompleted = true;
            } else {
                checker = $timeout($scope.refreshStatus, 5000);
            }
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
            $scope.refreshStatus();
        }, function (error) {

        });
    }

    $scope.getUserInfo();

}]);