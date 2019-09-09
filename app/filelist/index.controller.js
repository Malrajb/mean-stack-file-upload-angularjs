(function () {
    'use strict';

    angular
        .module('app')
		//.service('FileUploader', FileUploader)
        .controller('filelist.IndexController', Controller);

    function Controller($window, $scope, $http, $filter, Upload, ngTableParams, UserService, FlashService) { 
        var vm = this;

        vm.user = null;
		vm.totalFilesCount = 0;		
		$scope.uploads = {};        
		$scope.uploadList = {};        
        initController();
		
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
            }); 
			
			// Get logged user files
			function getMyFiles(){
				$http.get('/api/files/list').then(function(response){								
					$scope.uploadsdata = response.data.fileList;  				 		   
					
					if (!response.data.error) {		 
						//dataTable.render($scope, '', "uploadList", response.data.fileList);
						$scope.uploadList = new ngTableParams( { page: 1, count: 5}, {

								total: $scope.uploadsdata.length,

								getData: function ($defer, params) {

									$scope.uploads = params.sorting() ? $filter('orderBy')($scope.uploadsdata, params.orderBy()) : $scope.uploadsdata;

									$scope.uploads = params.filter() ? $filter('filter')($scope.uploads, params.filter()) : $scope.uploads;

									$scope.uploads = $scope.uploads.slice((params.page() - 1) * params.count(), params.page() * params.count());

									$defer.resolve($scope.uploads);

								}

						});  


						//$scope.usersTable = new ngTableParams({}, { dataset: $scope.uploadsdata });					
					}				
				});
			} 
			getMyFiles();	
			
			$scope.download = function(file) {
				$http.get('/uploads').then(function(response){										
					$scope.uploads = response.data;
				});
			}
		    $scope.submit = function(){
				Upload.upload({
				url: '/api/files/uploadfile',
				method: 'post',
				data: $scope.upload
			}).then(function (response) {			 
				$scope.uploads = {};
				$scope.uploadList = {};
				console.log(" DDD scope.uploadList NEW");
				getMyFiles();			  
			})
		    } // submit end
        }	// initController end
		
		
		
		
    }

})();