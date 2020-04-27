var userModel = require("../models/users");

module.exports.isSignin =  isSignin = (req,res,next)=>{
    userModel.findOne({_id:req.signedCookies.userID},function(err,data){
        if(data){
            res.redirect("/chatbox");
            return;
        }
        else{
            next();
        }
    })
}


module.exports.requireAuth = (req,res,next)=>{
    if(!req.signedCookies.userID){
        res.redirect("/");
        return;
    }

    userModel.findOne({_id:req.signedCookies.userID},function(err,data){
        if(!data){
            res.redirect("/");
            return;
        }
    })

    next();
}