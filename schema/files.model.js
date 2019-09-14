const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FileSchema = new Schema({
	title  : {type:String, max:100, required:true },
	user_id : {type:Schema.Types.ObjectId, ref: 'users',required:true  },
	file: Object,	
	createdAt : {type: Date, required:true},
	updatedAt : {type: Date},
});
	
module.exports = mongoose.model('files', FileSchema);