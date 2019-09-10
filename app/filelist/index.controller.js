(function () {
    'use strict';

    angular
        .module('app')		
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
					 	 		   
					$scope.uploadsdata = [];					
					//convert multidimensional into single dimension
					var records = response.data.fileList;					 
					 
				    angular.forEach(records, function(row){	
						var fileobj = {}; 					
						fileobj.name = row.name; 
						fileobj.originalname = row.file.originalname; 
						fileobj.mimetype = row.file.mimetype; 
						fileobj.size = row.file.size;					  
						fileobj.path = row.file.path;					  
					    $scope.uploadsdata.push(fileobj);					           
				    });   	
					
					// ng-sorting and filters
					if (!response.data.error) {		 
						
						$scope.uploadList = new ngTableParams( { page: 1, count: 5}, {

								counts:[5,10,25,50,100],
								
								total: $scope.uploadsdata.length,

								getData: function ($defer, params) {

									$scope.uploads = params.sorting() ? $filter('orderBy')($scope.uploadsdata, params.orderBy()) : $scope.uploadsdata;

									$scope.uploads = params.filter() ? $filter('filter')($scope.uploads, params.filter()) : $scope.uploads;

									$scope.uploads = $scope.uploads.slice((params.page() - 1) * params.count(), params.page() * params.count());

									$defer.resolve($scope.uploads);

								}

						});  										
					}				
				});
			} 
			getMyFiles();	
			
			/* $scope.download = function(file) {
				$http.get('/uploads').then(function(response){										
					$scope.uploads = response.data;
				});
			} */
		    $scope.submit = function(){
				Upload.upload({
				url: '/api/files/uploadfile',
				method: 'post',
				data: $scope.upload
			}).then(function (response) {			 
				$scope.uploads = {};
				$scope.uploadList = {};
				// callback function for get user file list
				getMyFiles();			  
			})
		    } // submit end
        }	// initController end	
		
    }

})();