const mongoose = require('mongoose');
const {save} = require('../../helpers/db.helper');
require('../model/profile.model');
const profileModel = mongoose.model('profile');
module.exports.Create = (data)=>{
    return new Promise((resolve,reject)=>{
          save(profileModel,data).then((response)=>resolve(response))
          .catch((e)=>{
            // logger.error(`create Service Error: ${JSON.stringify(e)}`);
            reject(e);
          })
    })
}