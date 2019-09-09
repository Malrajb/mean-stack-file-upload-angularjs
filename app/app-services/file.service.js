(function () {
    'use strict';

    angular
        .module('app')
        .factory('FileService', Service);

     function Service($http, $q) {
        var service = {};
		initService();

        return service;

        function initService() {
            console.log("initService called");
        }

        
    }

})();