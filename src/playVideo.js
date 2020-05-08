function playVideo(stream,idVideo){
    var video = document.getElementById('idVideo');
        video.srcObject = stream;
        video.onloadedmetadata = function(e) {
        video.play();
    };
}

module.exports = playVideo;