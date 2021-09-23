const mongoose = require('mongoose');
const {Schema} = mongoose;
const shortid = require('shortid');

const register = new Schema({
    recordId:{
        type:String,
        required:true,
        default:shortid.generate

    },
    email:{
        type:String,
        required:true,
        unique:true
    },
     
    country:{
        type:String
    },
        
    
},{
    timestamps:true,
});
module.exports = mongoose.model('register',register)