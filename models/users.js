var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    id : String,
    pass : String,
    name : String,
    img : String,
    status : String,
    socketID : String
})

module.exports = mongoose.model("users",userSchema);