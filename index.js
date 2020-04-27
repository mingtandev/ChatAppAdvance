var express = require("express");
var app = express();
const bodyParser = require('body-parser')
var cookieParser = require('cookie-parser')

//set up socketio
var server = require("http").Server(app);
const io = require("socket.io")(server)



app.use(express.static("public"));
app.set("view engine", "ejs");
app.set("views", "./views");
app.use(bodyParser.json()) // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })) // for parsing application/x-www-form-urlencoded
app.use(cookieParser("CLGT"));

//mongodb

var mongoose = require("mongoose");

mongoose.connect("mongodb://localhost:27017/chatapp", { useNewUrlParser: true }, function (err) {
    if (err)
        throw err;
    console.log("Connection succesfull");
})

//socket io

io.on("connection", function (socket) {
    console.log("Co thang dang nhap");

    socket.on("from-client-chat-mess", function (msg) {
        socket.broadcast.emit("from-server-chat-mess", msg);
        socket.emit("PRI-from-server-chat-mess", msg)
    })
})

//script
//models

var userModel = require("./models/users");
var Authencation = require("./middleware/requireAuth")
var controller_login = require("./controller/login.controller")
app.get("/", Authencation.isSignin ,  (req, res) => {
    res.render("signin");
})

app.get("/chatbox",Authencation.requireAuth , (req,res)=>{
    res.render("chatbox");
})

app.post("/login", controller_login.login)

server.listen(3000);