const playVideo = require("./playVideo");
const $ = require("jquery");
const Peer = require("simple-peer");

function OpenCamera() {
    navigator.mediaDevices.getUserMedia({ audio: false, video: true })
        .then(function (stream) {
            playVideo(stream, 'localStream');

            const p = new Peer({ initiator: location.hash === "#1", trickle: false , stream });

            //Quy trình thực hiện:
            // 1: Offer là location có hash sẽ auto sinh ra offer token
            // 2: Offer token này sẽ gửi qua cho bên nhận , bên nhận sẽ p.signal => tạo ra một asnwe token
            // 3: Khi có answer token thì offer sẽ lấy token đó và connect => 2 bên connect với nhau


            //Khi co connect thi p.on signal duoc thuc hien(khi p.signal duoc goi , thi p.on signal lang nghe)
            //vi ban dau location #1 la co san nen khong can thuc hien ket noi , ma chi thuc hien ket noi den voi cac may k co hash
            p.on("signal", function (token) {
                $("#txtSignal").val(JSON.stringify(token));
            })


            $('#connectBtn').click(() => {
                const friendSignal = JSON.parse($('#inputToken').val());
                //De sinh ra token answer thi goi p signal => cho hash truy cap vao
                p.signal(friendSignal);
            })


            p.on("connect", () => {
                console.log("connected");
            })

            //Khi co stream cả 2 phía sẽ playvideo
            p.on("stream",friendStream => { playVideo(friendStream,'friendStream') })


        })
        .catch(function (err) {

        })

}

module.exports = OpenCamera;
