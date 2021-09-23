const registerService = require('../service/register.service');
module.exports.regUser = async  (req,res,next)=>{
    const {body} = req;
    const response = await registerService.create(body)
    res.send(response)
} 