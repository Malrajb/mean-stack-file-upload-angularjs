(function () {
    'use strict';

    angular
        .module('app')		
        .controller('filelist.IndexController', Controller);

    function Controller($window, $scope, $rootScope, $http, $filter, $timeout, Upload, ngTableParams, UserService, FlashService, FileService) { 
        var vm = this;

        vm.user = null;
		vm.totalFilesCount = 0;		
		$scope.data = [];      
		$scope.uploadsdata = [];		
		$scope.tableParams = {};        
		$scope.uploaded_file_id = 0;        
        initController();
		
        function initController() {
            // get current user
            UserService.GetCurrent().then(function (user) {
                vm.user = user;
				$rootScope.logged_user = user;
            }); 			
			 
			getMyFiles();		    			
			
        }	// initController end	
		
		function toggleOverlay(){
			$('#spinner, #overlay').toggle();
		}
		
		// Get logged user files
		function getMyFiles(){
			FileService.getMyFiles().then(function (response) {				   
				 
				if (!response.error) {
					
					$scope.data = [];
					$scope.uploadsdata = [];
					 					
					//convert multidimensional into single dimension
					var records = response.fileList;					 
			 
					angular.forEach(records, function(row){	
						var fileobj = {}; 					
						fileobj._id = row._id; 
						fileobj.title = row.title; 
						fileobj.filename = row.file.filename; 
						fileobj.originalname = row.file.originalname; 
						fileobj.mimetype = row.file.mimetype; 
						fileobj.size = row.file.size;					  
						fileobj.path = row.file.path;					  
						$scope.uploadsdata.push(fileobj);					           
					});   						
				 
					
					// ng-sorting and filters
					$scope.tableParams = new ngTableParams( { page: 1, count: 5,sorting:{createdAt:'desc'}}, {

						counts:[5,10,20,50,100],					
						total: $scope.uploadsdata.length,
						getData: function ($defer, params) {							
							$scope.uploadsdata = params.sorting() ? $filter('orderBy')($scope.uploadsdata, params.orderBy()) : $scope.uploadsdata;
							$scope.uploadsdata = params.filter() ? $filter('filter')($scope.uploadsdata, params.filter()) : $scope.uploadsdata;
							$scope.data = $scope.uploadsdata.slice((params.page() - 1) * params.count(), params.page() * params.count());
							$defer.resolve($scope.data);
						}
					});	
				}				
			});
		}
		
		// aother sample image file validation
		/*
		$(document).ready(function() {
		  var _URL = window.URL || window.webkitURL;
		  var maxFieSize = 1024*1024*2; // 2MB
			$('#file-0').bind('change', function() {
			var file = this.files[0], img;
			if (Math.round(file.size) > maxFieSize) { // make it in MB so divide by 1024*1024
			   alert('Please select image size less than 2 MB');
			   $('#file-0').val('');
			   return false;
			}
			if (file) {
			  img = new Image();
			  img.onload = function() {
				$('.submit-btn').prop('disabled', false);
				$(".error_line").fadeOut();
				
			  };
			  img.onerror = function() {
				$('.submit-btn').prop('disabled', true);
				$(".error_line").fadeIn();
			  };
			  img.src = _URL.createObjectURL(file);
			}
		  });
		});
		*/
		
		// Best for user defined file format validation
		$(document).ready(function() {
			var maxFieSize = 1024*1024*2; // 2MB
			$('#file-0').bind('change', function() {
				var filename = this.files[0].name;				
				var extn = filename.split(".").pop().toLowerCase();			
				
				//file type validation
				var validFormats = ['jpg','jpeg','gif','png','txt','doc','docx','pdf','xls','xlsx','zip'];
				if(validFormats.indexOf(extn) == -1){
					alert('Please select a valid file. Allowed types are : '+validFormats.join(', '));
					$('#file-0').val('');
					return false;
				} 	
				
				//file size validation
				var filesize=(this.files[0].size);				
				if(filesize > maxFieSize ) { 
					alert('Large file. Please select file less than or equal to 2 MB');
					$('#file-0').val('');
					return false;
				};
			}); 
		});
		
		$scope.uploadFile = function(){
			var title = $.trim($('#title').val());
			var filename = $.trim($('#file-0').val());
			if(title =='' || title ==""){
				alert('Please enter a title');
				return false;
			}		
			if(filename =='' || filename ==""){
				alert('Please select a file');
				return false;
			} 
			
			// show overlay 
			toggleOverlay();
			
			//	file upload process	
			var data = {
				url: '/api/files/uploadfile',
				method: 'post',
				data: $scope.upload
			}
			
			FileService.uploadFile(Upload,data).then(function (response) {
				
				// for high lighting uploaded file record
				$scope.uploaded_file_id = response.fileData.insertedIds[0]; 
				
				//Flash message
				FlashService.Success('File uploaded successfully!');
				
				//Dynamically sets count value for resolving pagination issue 
				$scope.tableParams.count(6);
				
				// callback function for get user file list
				getMyFiles();
				
				$timeout( function(){									
									// removing high light using timeout
									remove_high_light();
									$("#flash-widget").fadeOut('slow'); 
									FlashService.clearFlashMessage();
									// hide overlay
									toggleOverlay();									
						}, 3000);
			});			
		}	 
			
		// remove high light for recent uploaded record			
		function remove_high_light(){
			$scope.uploaded_file_id = 0;
			$('#uploadListTbl tr').removeClass('recent_uploaded_file');
		}		

		// delete a file
		$scope.deleteFile = function(_id,filename,row_id){			
			var confirmed = $window.confirm("Are you sure want to delete this record?");
			if(confirmed){
				
				// show overlay
				toggleOverlay();
				
				var data = {_id:_id,filename:filename};
				
				FileService.deleteFile(data).then(function (response) {
					if(response=='OK'){						 
						$("#"+row_id).fadeOut('slow');
						FlashService.Success('File deleted successfully!');						
						 
						$timeout( function(){	
							//Dynamically sets count value for resolving pagination issue 
							$scope.tableParams.count(6);
							// callback function for get user file list
							getMyFiles();
							$("#flash-widget").fadeOut('slow'); 
							FlashService.clearFlashMessage(); 
							// hide overlay 
							toggleOverlay();							
						}, 3000);	
							
					}else{
						FlashService.Error('Error happens on deleting the file. Please try again.');	
					}					
				});
			}
		}	
		
    }

})();