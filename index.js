var express = require("express");
var app = express();

var multer  = require('multer')
var upload = multer({ dest: './public/uploads/' })
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


//models

var userModel = require("./models/users");
var chatModel = require("./models/chatHis")
var Authencation = require("./middleware/requireAuth")
var controller_login = require("./controller/login.controller")


//socket io

io.on("connection", function (socket) {
    console.log("Co thang dang nhap");
    
    socket.on("form-client-showUserOnline",function(data){
        userModel.findOneAndUpdate({_id : data.id},{status : "online"},function(err,data){
            if(err){
                res.send("Save status error");
            }
        });
        socket.broadcast.emit("from_sever_showUserOnline" , data);
    })
    socket.on("from-client-chat-mess", function (msg) {
        var newChat = chatModel({
            content : msg.content,
            name : msg.name,
            img : msg.img,
        })
        newChat.save();
        io.sockets.emit("from-server-chat-mess",msg);
    })
})

//script



//Authencation.isSignin
app.get("/" ,  (req, res) => {


    res.render("signin");
})

app.get("/register",(req,res)=>{
    if(req.query.valid==1){
        res.render("register.ejs",{
            valid : 1,
        })
    }
    else{
        res.render("register.ejs")
    }
})


//Authencation.requireAuth
app.get("/chatbox" , async (req,res)=>{

    var myChatlog = await chatModel.find();
    userModel.find(function(err,data){
        if(err)
            throw err;

        var myUser;
        var listUser = data.filter(function(e){
            if(e._id == req.signedCookies.userID){
                myUser = e;
                //set online your account
                userModel.findOneAndUpdate({_id:e._id},{status : "online"},function(err){
                    if(err){
                        res.send("Set online your account error");
                    }
                })
                return false;
            }
            return true;
        })
       
        res.render("chatbox",{
            listUser : listUser,
            myUser : myUser,
            ChatLog : myChatlog,
        });
    })
    
})

app.post("/login", controller_login.login)

// req.file.path.split("\\").splice(1).join("/")
app.post("/edit/:id", upload.single('avatar') , (req,res)=>{
    if(!req.file.path){
        var query = { _id : req.params.id};
        var update = {name : req.body.name};
        userModel.findOneAndUpdate(query,update , function(err){
            if(err)
                res.send("Error : " , + err);
            else 
                res.redirect("/chatbox");
        })
    }
    else{
        var query = { _id : req.params.id};
        var update = {name : req.body.name , img : req.file.path.split("\\").splice(1).join("/")};
        userModel.findOneAndUpdate(query,update , function(err){
            if(err)
                res.send("Error : " , + err);
            else 
                res.redirect("/chatbox");
        })
    }
})

app.post("/registering" , (req,res)=>{
    
    var newUser = new userModel({
        id:req.body.userName,
        pass : req.body.pass,
        name : req.body.name,
        img : "/uploads/default",
        status : "busy",
    })

    newUser.save();

    res.redirect("/register?valid=1");
})

server.listen(3000);