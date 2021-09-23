const mongoose = require('mongoose');
const {save} = require('../../helpers/db.helper')
require('../model/register.model')
const Model = mongoose.model('register');
module.exports.create = (data)=>{
    return new Promise((resolve,reject)=>{
        save(Model,data).then((response) => resolve(response))
        .catch((e) => {
        logger.error(`create Service Error: ${JSON.stringify(e)}`);
        reject(e);
        });
    })
}
