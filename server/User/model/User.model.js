const mongoose = require('mongoose');
const {Schema} = mongoose;
const shortid = require('shortid');
const userSchema = new Schema({
     userId:{
         type:String,
         required:true,
         default:shortid.generate
     },
     mobilenumber:{
         type:Number,
         required:true
         
     },
     countrycode:{
         type:String,
         required:true,
         default:91
     },
     profileCompletion:{
         type:String,
         required:true,
         Enum: ["PARTIAL", "COMPLETED"],
         default: "PARTIAL",
     },
     status:{
         type:String,
         required:true,
         default: "PENDING",
         Enum: ["PENDING", "VERIFIED", "REJECTED", "BLOCKED"]
         },
         createdAt:{
             type:Date,
             timestamps:true
         },
         updatedAt:{
             type:Date,
            timestamps:true
         }
},{
    timestamps:true
});
module.exports = mongoose.model('User',userSchema);