const mongoose = require('mongoose');
const {save} = require('../../helpers/db.helper')
const {getOneDoc} = require('../../helpers/db.helper')
require('../model/User.model');
const userModel  = mongoose.model('User');
module.exports.createUser = (data)=>{
  return  new Promise((resolve,reject)=>{
       save(userModel,data)
       .then((response)=>resolve(response))
       .catch((e)=>reject(e))
    })
}
module.exports.findUser = (data)=>{
  return  new Promise((resolve,reject)=>{
    getOneDoc(userModel,data)
    .then((response)=>resolve(response))
    .catch((e)=>reject(e))
 })
}