const mongoose = require('mongoose');
const {save} = require('../../helpers/db.helper');
require('../model/otp.model');
const otpModel = mongoose.model('otpmodel');
module.exports.CreateOtp= (data)=>{
    return new Promise((resolve,reject)=>{
          save(otpModel,data).then((response)=>resolve(response))
          .catch((e)=>{
            // logger.error(`create Service Error: ${JSON.stringify(e)}`);
            reject(e);
          })
    })
}