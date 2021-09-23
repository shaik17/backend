const profileService = require('../service/profile.service');
module.exports.createProfile = async (req,res,next)=>{
    const {body} = req;
    const response = await profileService.Create(body)
    res.send(response)
};