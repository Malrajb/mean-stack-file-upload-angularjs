(function () {
    'use strict';

    angular
        .module('app')		
        .controller('filelist.IndexController', Controller);

    function Controller($window, $scope, $rootScope, $http, $filter, $timeout, Upload, ngTableParams, UserService, FlashService, FileService) { 
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
			FileService.getMyFiles().then(function (response) {								
				
				$scope.uploadsdata = [];   
				 
				if (!response.error) {
					 					
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
				if(filesize > maxFieSize ) { //
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
			
			//	file upload process	
			var data = {
				url: '/api/files/uploadfile',
				method: 'post',
				data: $scope.upload
			}
			
			FileService.uploadFile(Upload,data).then(function (response) {
				
				// for high lighting first row
				$scope.file_uploaded = 1; 
				
				//Flash message
				FlashService.Success('File uploaded successfully!');
				$timeout( function(){	
									// removing high light using timeout
									remove_high_light();
									$("#flash-widget").fadeOut('slow');  
						}, 5000);
						
				$timeout( function(){	FlashService.clearFlashMessage();}, 7000);
						
				$scope.uploads = {};
				$scope.uploadList = {};
				
				// callback function for get user file list
				getMyFiles();			  
			});			
		}	 
			
		// remove high light for recent uploaded record			
		function remove_high_light(){
			$scope.file_uploaded = 0;
			$('#uploadListTbl tr').removeClass('recent_uploaded_file');
		}		

		// delete a file
		$scope.deleteFile = function(_id,filename,row_id){			
			var confirmed = $window.confirm("Are you sure want to delete this record?");
			if(confirmed){
				var data = {_id:_id,filename:filename};
				
				FileService.deleteFile(data).then(function (response) {
					if(response=='OK'){						 
						$("#"+row_id).fadeOut('slow');
						FlashService.Success('File deleted successfully!');
						// callback function for reload ng-table
						getMyFiles();
						$timeout( function(){	$("#flash-widget").fadeOut('slow');  }, 5000);	
						$timeout( function(){	FlashService.clearFlashMessage();}, 7000);	
					}else{
						FlashService.Error('Error happens on deleting the file. Please try again.');	
					}					
				});
			}
		}	
		
    }

})();