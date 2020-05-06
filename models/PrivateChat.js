var mongoose = require("mongoose");

var chatHistory = new mongoose.Schema({
    from : String,
    to : String,
    content : String,
    name : String,
    img : String,
})

module.exports = mongoose.model("privatechathis",chatHistory);