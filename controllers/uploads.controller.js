var config = require('config.json');
var express = require('express');
var fs = require('fs');
var multer = require('multer');
var upload = multer({dest: 'uploads/'});
var path = require('path');
var router = express.Router(); 

// routes
router.get('/:uuid/:filename/', downloadFile);
module.exports = router;

function downloadFile(req, res, next) {
   
	var mongo = require('mongoskin');
	var db = mongo.db(config.connectionString, { native_parser: true });
	db.bind('files'); 
    db.files.findOne({
		'file.filename': req.params.uuid,
		'file.originalname': req.params.filename
    }, function (err, result) {

		if (err){ next(err);}
		else { 
		  res.set({
			"Content-Disposition": 'attachment; filename="' + result.file.originalname + '"',
			"Content-Type": result.file.mimetype
		  });
		  fs.createReadStream(result.file.path).pipe(res);
		}
    }); 
 }

