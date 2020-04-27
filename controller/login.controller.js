var userModel = require("../models/users")

module.exports.login = (req, res) => {
    userModel.findOne({ id : req.body.userName }, function (err, data) {
        if (!data) {
            res.render("signin", {
                error: "Wrong user name",
            })
            return;
        }
        if(req.body.pass!=data.pass){
            res.render("signin", {
                error: "Wrong password",
            })
            return;
        }

        res.cookie("userID",data._id,{
            signed:true,
        })
        res.redirect("/chatbox");
    })

}