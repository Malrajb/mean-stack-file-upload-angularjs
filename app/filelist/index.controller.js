(function () {
    'use strict';

    angular
        .module('app')		
        .controller('filelist.IndexController', Controller);

    function Controller($window, $scope, $rootScope, $http, $filter, $timeout, Upload, ngTableParams, UserService, FlashService) { 
        var vm = this;

        vm.user = null;
		vm.totalFilesCount = 0;		
		$scope.uploads = {};        
		$scope.uploadList = {};        
		$scope.file_uploaded = 0;        
        initController();
		
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				$rootScope.logged_user = user;
            }); 			
			 
			getMyFiles();		    			
			
        }	// initController end	
		
		
		// Get logged user files
		function getMyFiles(){
			$http.get('/api/files/list').then(function(response){								
							   
				$scope.uploadsdata = [];					
				//convert multidimensional into single dimension
				var records = response.data.fileList;					 
				 
				angular.forEach(records, function(row){	
					var fileobj = {}; 					
					fileobj._id = row._id; 
					fileobj.name = row.name; 
					fileobj.filename = row.file.filename; 
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
		
		$scope.uploadFile = function(){
			Upload.upload({
				url: '/api/files/uploadfile',
				method: 'post',
				data: $scope.upload
			}).then(function (response) {	
				
				// for high lighting first row
				$scope.file_uploaded = 1;
				// removing high light using timeout
				$timeout( function(){ remove_high_light(); }, 3000);
				
				$scope.uploads = {};
				$scope.uploadList = {};
				
				// callback function for get user file list
				getMyFiles();			  
			})
		} // uploadFile end
			
		// remove high light for recent uploaded record			
		function remove_high_light(){
			$scope.file_uploaded = 0;
			$('#uploadListTbl tr').removeClass('recent_uploaded_file');
		}

		// delete a file
		$scope.deleteFile = function(_id,filename,row_id){			
			var confirmed = window.confirm("Are you sure want to delete?");
			if(confirmed){
				var data = {_id:_id,filename:filename};
				$http.post('/api/files/deleteFile',data).then(function(response){
					if(response.status==200){					 
						$("#"+row_id).fadeOut('slow');
						$timeout( function(){alert('File deleted successfully!');}, 1000);	
					}else{console.log(response);
						alert('Error happens on deleting the file. Please try again.');	
					}					
				});
			}
		}	
		
    }

})();