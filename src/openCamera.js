const playVideo = require("./playVideo");


function OpenCamera(){
    navigator.mediaDevices.getUserMedia({audio:false,video:true})
    .then(function(stream){
        playVideo(stream,'localStream');
    })
    .catch(function(err){

    })

}

module.exports = OpenCamera;
