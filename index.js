var express = require("express");
var app = express();

var multer = require('multer')
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
var privateChatModel = require("./models/PrivateChat");




//main


//One map to refer between socket id and objectID(user)

var referID = new Map();


//socket io

io.on("connection", function (socket) {

    //save socket to referID like as key
    // and _id like as value
    //Khi co nguoi load thi set map , dong thoi sua trong db la online
    socket.on("form-client-showUserOnline", function (data) {

        //save key is data id , socket id is value , when socket modifily => only change value
        referID.set(socket.id, data.id);

        userModel.findOneAndUpdate({ _id: data.id }, { status: "online" }, function (err, data) {
            if (err) {
                res.send("Save status error");
            }

        });
        socket.broadcast.emit("from_sever_showUserOnline", data);
    })
    socket.on("from-client-chat-mess", function (msg) {
        var newChat = chatModel({
            content: msg.content,
            name: msg.name,
            img: msg.img,
        })
        newChat.save();
        io.sockets.emit("from-server-chat-mess", msg);
    })



    socket.on("from-client-chat-mess-private", function (msg) {
        var newChat = privateChatModel({
            from : msg.from,
            to : msg.to,
            content: msg.content,
            name: msg.name,
            img: msg.img,
        })
        newChat.save();
        io.sockets.emit("from-server-chat-mess", msg);
    })


    //xu ly thoat trang web
    socket.on("disconnect", () => {
        //Edit status in db
        var idOut = referID.get(socket.id);
        
        userModel.findOneAndUpdate({ _id: idOut }, { status: "busy" }, function (err) {
            if (err) {
                res.send("Save status error");
            }
        })

        referID.delete(socket.id);

        socket.broadcast.emit("from_sever_showUserOffline", {
            id : idOut
        });
    })



})



//script



//Authencation.isSignin
app.get("/", (req, res) => {

    userModel.updateMany({},{socketID : undefined},function(err){});
    res.render("signin");
})

app.get("/register", (req, res) => {
    if (req.query.valid == 1) {
        res.render("register.ejs", {
            valid: 1,
        })
    }
    else {
        res.render("register.ejs")
    }
})


//Authencation.requireAuth
app.get("/chatbox", async (req, res) => {


    var myChatlog = await chatModel.find();
    userModel.find(function (err, data) {
        if (err)
            throw err;

        var myUser;
        var listUser = data.filter(function (e) {
            if (e._id == req.signedCookies.userID) {
                myUser = e;
                //set online your account
                userModel.findOneAndUpdate({ _id: e._id }, { status: "online" }, function (err) {
                    if (err) {
                        res.send("Set online your account error");
                    }
                })
                return false;
            }
            return true;
        })

        res.render("chatbox", {
            listUser: listUser,
            myUser: myUser,
            ChatLog: myChatlog,
        });
    })
})



//Private chat render
app.get("/chatbox/:id",  async (req, res) => {

   
    var myChatlog = await privateChatModel.find({
       $or : [
           {
               from : req.signedCookies.userID,
               to : req.params.id
           },

           {
                from : req.params.id,
                to : req.signedCookies.userID
           }

       ]
    });

    var ToUser = await userModel.find({_id : req.params.id})

    userModel.find(function (err, data) {
        if (err)
            throw err;

        var myUser;
        var listUser = data.filter(function (e) {
            if (e._id == req.signedCookies.userID) {
                myUser = e;
                //set online your account
                userModel.findOneAndUpdate({ _id: e._id }, { status: "online" }, function (err) {
                    if (err) {
                        res.send("Set online your account error");
                    }
                })
                return false;
            }
            return true;
        })
        res.render("privatechat", {
            listUser: listUser,
            myUser: myUser,
            ChatLog: myChatlog,
            ToUser : ToUser[0]
            
        });
    })
})




app.post("/login", controller_login.login)

// req.file.path.split("\\").splice(1).join("/")
app.post("/edit/:id", upload.single('avatar'), async (req, res) => {

    if (!req.file) {
        var curUser = await userModel.findOne({_id: req.params.id});
        var query = { _id: req.params.id };
        var update = { name: req.body.name };
        userModel.findOneAndUpdate(query, update, function (err) {
            if (err)
                res.send("Error : ", + err);
            else
                res.redirect("/chatbox");
        })
        //change in chatlog
        chatModel.updateMany({name : curUser.name},{name : req.body.name},function(){});
        privateChatModel.updateMany({name : curUser.name},{name : req.body.name},function(){});
    }
    else {
        console.log(req.file.path);
        console.log("_________________________");
        var query = { _id: req.params.id };
        var update = { name: req.body.name, img: req.file.path.split("\\").splice(1).join("/") };
        userModel.findOneAndUpdate(query, update, function (err) {
            if (err)
                res.send("Error : ", + err);
            else
                res.redirect("/chatbox");
        })
    }
})

app.post("/registering", (req, res) => {

    var newUser = new userModel({
        id: req.body.userName,
        pass: req.body.pass,
        name: req.body.name,
        img: "/uploads/default",
        status: "busy",
    })

    newUser.save();

    res.redirect("/register?valid=1");
})

server.listen(3000);