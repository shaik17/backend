const mongoose = require('mongoose');
const {Schema} = mongoose;
const shortid = require('shortid');

const profile  = new Schema({
     profileId:{
         type:String,
         required:true,
         default:shortid.generate
     },
     name:{
         type:String,
         required:true
     },
     email:{
         type:String,
         required:true
     },
     designation:{
         type:String,
         reqired:true
     }
},{
    timestamps:true
});
module.exports = mongoose.model('profile',profile)