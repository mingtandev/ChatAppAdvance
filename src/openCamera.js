
function OpenCamera(callback) {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(function (stream) {
            //Chủ yếu là lấy tham số stream ra khỏi tác vụ bất đồng bộ
           callback(stream);
        })
        .catch(function (err) {

        })

}
 
module.exports = OpenCamera;
