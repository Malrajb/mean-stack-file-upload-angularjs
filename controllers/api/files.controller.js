var config = require('config.json');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var path = require('path');
var router = express.Router();
var userService = require('services/user.service');
var fileService = require('services/file.service');

// routes
router.get('/list/', getUserFiles);
router.post('/deleteFile/', deleteFile);
				
router.post('/uploadfile', upload.single('file'), function (req, res, next) {

    var userId = req.user.sub; 
	var fileParam = {};		

	fileParam.title = req.body.title;      
    fileParam.file = req.file;
		 
	if (fileParam.title != '') {
		
		fileService.insertFile(userId,fileParam)
			.then(function (fileData) {
				res.send({'status':200,'fileData':fileData});
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on update file');
	}
});
//router.post('/update-file', updateFile);

module.exports = router;
 
function getUserFiles(req, res) {  
	//get logged user id
    var userId = req.user.sub;   
    
	fileService.getUserFiles(userId)
        .then(function (fileList) {
            res.send({'status':200,'fileList':fileList});
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
} 

/* 
function updateFile(req, res) {
    var userId = req.user.sub; 
	var fileParam = {};
	fileParam._id = req.body._id;
	fileParam.isDone = req.body.isDone;	 
	fileParam.userId = userId; 
	
    if (fileParam._id != '') {
        
		fileService.update(fileParam)
			.then(function () {
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on update file');
	}	
} */

function deleteFile(req, res) {
    
	var userId = req.user.sub;
	var fileId = req.body._id;
	var filename = req.body.filename;
	if(userId !='' && fileId !=''){
		fileService.deleteFile(fileId,userId)
			.then(function () {
				
				/* 
				//gets your app's root path
				var root = path.dirname(require.main.filename); 				
				var filePath = root+"/uploads/"+filename; 
				*/
				var filePath = path.resolve("./uploads/"+filename);			 
				 
				fs.unlink(filePath, function(error) { 
				
					// file doens't exist error
					if(error && error.code == 'ENOENT') {						
						console.info("File doesn't exist, won't remove it. Given filePath :", filePath);
					}
					// other errors, e.g. maybe we don't have enough permission					
					else if (error) {						
						console.log("Error occurred while trying to remove the file. Given filePath :", filePath);
					} else {
						console.info("File deleted successfully!");
					}
				});
				
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on delete file');
	}		
} 