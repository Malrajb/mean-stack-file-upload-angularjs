(function () {
    'use strict';

    angular
        .module('app')
        .factory('FileService', Service);

     function Service($http, $q) {
        var service = {};
		service.getMyFiles = getMyFiles;
		service.deleteFile = deleteFile;
		service.uploadFile = uploadFile;

        return service;        
		
		function getMyFiles() { 	
            return $http.get('/api/files/list').then(handleSuccess, handleError);
        }
		
		function deleteFile(data) { 	
            return $http.post('/api/files/deleteFile',data).then(handleSuccess, handleError);
        }
		
		function uploadFile(Upload,data) {	
            return Upload.upload(data).then(handleSuccess, handleError);
        }

		// private functions

        function handleSuccess(res) {
            return res.data;
        }

        function handleError(res) {
            return $q.reject(res.data);
        }
        
    }

})();