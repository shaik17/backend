const mongoose = require('mongoose');
const {Schema} = mongoose;
const shortid = require('shortid');
const otpSchema = new Schema({
         entryId:{
             type:String,
             required:true,
             default:shortid.generate
         },
         userId:{
            type:Schema.Types.ObjectId,
            ref:'User'
         },
         otp:{
             type:Number,
             required:true,
             

          },
         expiryAt:{
             type:Date,
             required:true,
             default:Date.now,
             expires:1000

         },
         status:{
             type:String,
             required:true,
             default:"PENDING",
             Enum: ["PENDING", "VERIFIED", "EXPIRED"]
            },
            createdAt:{
                type:Date,
                timestamps:true
            },
            updatedAt:{
                type:Date,
                timestamps:true

            },

     
},{
    timestamps:true
})
module.exports = mongoose.model('otpmodel',otpSchema);