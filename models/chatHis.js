var mongoose = require("mongoose");

var chatHistory = new mongoose.Schema({
    content : String,
    name : String,
    img : String,
})

module.exports = mongoose.model("chathis",chatHistory);