var config = require('config.json');
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var Q = require('q');
var mongo = require('mongoskin');
var db = mongo.db(config.connectionString, { native_parser: true });
db.bind('files');

var service = {};
 
//service.getAllFiles = getAllFiles;
service.getUserFiles = getUserFiles;
service.insertFile = insertFile;
service.update = update;
service.deleteFile = deleteFile;

module.exports = service; 

function getUserFiles(userId) {	 
    var deferred = Q.defer();
	
	db.collection('files').find({user_id:mongo.helper.toObjectID(userId)},{'sort':{createdAt:-1}}).toArray(function(err, result) {
		if (err) deferred.reject(err.name + ': ' + err.message);

        if (result) {
            // return file(s)  
            deferred.resolve(result);
        } else {
            // file not found
            deferred.resolve();
        }
    });  
	
    return deferred.promise;
}

function insertFile(userId,fileParam) {
    var deferred = Q.defer();
	var user_id = mongo.helper.toObjectID(userId);           
	fileParam.user_id = user_id;
	fileParam.createdAt = new Date(); 
		
	db.files.insert(
		fileParam,
		function (err, doc) {
			if (err) deferred.reject(err.name + ': ' + err.message);

			deferred.resolve();
		});
     

    return deferred.promise;
}


function update(fileParam) { 
    var deferred = Q.defer();
	var _id = fileParam._id;
	var userId = fileParam.userId;
	 
	var set = {
		isDone: fileParam.isDone,
		updatedAt : new Date()		
	};
	
	// fields to update with file id & userId 
	db.files.update(
		 { _id: mongo.helper.toObjectID(_id), user_id: mongo.helper.toObjectID(userId) },
		{ $set: set },
		function (err, doc) {
			if (err) deferred.reject(err.name + ': ' + err.message);

			deferred.resolve();
		});

    return deferred.promise;
}

function deleteFile(_id,userId) { 
    var deferred = Q.defer();
	
	// remove file with file id & userId 
    db.files.remove(
        { _id: mongo.helper.toObjectID(_id), user_id: mongo.helper.toObjectID(userId) },
        function (err) {
            if (err) deferred.reject(err.name + ': ' + err.message);

            deferred.resolve();
        });

    return deferred.promise;
}