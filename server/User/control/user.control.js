const mobileService = require('../service/user.service');
const otpService = require('../../otp-gen/service/otp.service');
var otpGenerator = require('otp-generator');
const UserModel = require('../model/User.model');

module.exports.userCreate = async (req,res,next)=>{
    const {body} = req;
    return mobileService.findUser(body)
     .then(async (response)=>{
         if(!response){
             return mobileService.createUser(body)
         }
         else{
             if("userId" in response){
        const myotp =  otpGenerator.generate(6, { upperCase: false, specialChars: false,alphabets:false });
        const profotp = await otpService.CreateOtp({
            userId:body.userId,
             otp:myotp
        })
   res.send(profotp);
    }
}
    })

    .catch(err=>res.json(err))
    
};