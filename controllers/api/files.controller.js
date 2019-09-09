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
				
router.post('/uploadfile', upload.single('file'), function (req, res, next) {

    var userId = req.user.sub; 
	var fileParam = {};		

	fileParam.name = req.body.name;      
    fileParam.file = req.file;
		 
	if (fileParam.title != '') {
		
		fileService.insertFile(userId,fileParam)
			.then(function () {
				res.sendStatus(200);
			})
			.catch(function (err) {
				res.status(400).send(err);
			});
	}else{
		return res.status(400).send('Something missing on update file');
	}
});
//router.post('/update-file', updateFile);
router.delete('/:_id', deleteFile);

module.exports = router;
 
function getUserFiles(req, res) {  
	//get logged user id
    var userId = req.user.sub;   
    
	fileService.getUserFiles(userId)
        .then(function (fileList) {
            res.send({'status':1,'fileList':fileList});
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
	var fileId = req.params._id;
	if(userId !='' && fileId !=''){
    fileService.delete(fileId,userId)
        .then(function () {
            res.sendStatus(200);
        })
        .catch(function (err) {
            res.status(400).send(err);
        });
	}else{
		return res.status(400).send('Something missing on delete file');
	}		
} 