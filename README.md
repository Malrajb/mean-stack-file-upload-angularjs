# Mean stack file upload management
This is a files management application that build with MEAN Stack using angularjs

The logged user can upload/view/downlaod their own files.

# Clone mean-stack-file-upload-management

Clone the repository using git:

git clone https://github.com/Malrajb/mean-stack-file-upload-angularjs

# Overview

. create database name with 'mean-stack-file-upload-angularjs' and import sample data under the folder 'DB' [ users.json, files.json ]

. run npm install
 
 Once after installed then, hit the command in root directory 
 
 Ex: C:\mean-stack-file-upload-angularjs> node server
 
 Now the app can be accessible in url : http://localhost:3060/ 
 
 
 # Now user can do the following, once after the Registration: 
 
 . Upload files 
 
 . View list of files

 . Download file 
 
 . Delete file 
 
 # Addtional informations:  
 "allow cross origin requests" implemented in server side (node js) using following script in main file of the node server
 
 app.use(function(req, res, next) { 
	res.setHeader("Access-Control-Allow-Methods", "POST, PUT, OPTIONS, DELETE, GET");
	res.header("Access-Control-Allow-Origin", "http://localhost:3060"); // change your hostname here
	res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
	next();
});

# Bootstrap:  
The responsive bootstrap layout integrated in front end
