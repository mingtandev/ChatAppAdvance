var express = require("express");
var app = express();

//set up socketio
var server = require("http").Sever(app);
const io = require("socket.io")(server)

//mongodb

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chatapp")

app.use(express.static("public"));
app.set("view engine" , "ejs");
app.set("views","./views");