const mongoose =require('mongoose'); 
const Schema = mongoose.Schema;

let UsersSchema = new Schema({
	firstName  : {type:String,  max:50, required:true },
	lastName  : {type:String,  max:50, required:true },
	username  : {type:String,  max:100, required:true },
	hash : {type:String  } 
});

module.exports = mongoose.model('users', UsersSchema);   