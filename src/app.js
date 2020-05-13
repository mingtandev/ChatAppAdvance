// const openCamera = require("./openCamera");
// const playVideo = require("./playVideo");
// const $ = require("jquery");
// // openCamera(function(stream){
// //     //mở video của phía mình
// //     playVideo(stream, 'localStream');
// // })

// const socket = io();
// const peer = new Peer({key : 'lwjd5qra8257b9'});
// //Khi có connect từ server thì event on sẽ thực hiện
// peer.on('open',(id)=>{
//     socket.emit("createPeerID",id);
//     console.log(id);
// });


// //Khi click button thi bat dau taos u kien call ( trong functionclick )
// //caller
// $('#connectBtn').click(()=>{
//     friendID = $('#remote-id').val();
//     openCamera(function(stream){
//         //truyền vào id cần gọi tới và stream của mình 
//         playVideo(stream, 'localStream');

//         const call = peer.call(friendID,stream)
//         //Event lắng nghe khi có call gọi tới , vì khi có kết nối thì call cung cấp stream của peer phía bên kia
//        // Sẽ hiện stream nếu phía bên kia trả lời được
//         call.on('stream',friendStram => {
//             playVideo(friendStram, 'friendStream');
//         })
//     })
// })

// var currCall;
// peer.on('call',function(call){

//     $('#showNotifiCall').trigger('click');
//     currCall=call;
   
// })


// $('#AcceptBtn').click(()=>{
//         openCamera(function(stream){
//             //Trả lời answer và truyền lại stream của chính mình
//             currCall.answer(stream)
//             // dòng trên khới tạo kết nối của chính mình
//             //gọi call on để  nhận được stream từ peer bên kia khi được trả lời
//             currCall.on('stream',friendStram => {
//                 playVideo(friendStram, 'friendStream');
//             })
//         })
    
// })


// //answer
// //Khi có sự kiện call tới
// // peer.on('call',function(call){
// //     openCamera(function(stream){
// //         //Trả lời answer và truyền lại stream của chính mình
// //         call.answer(stream)
// //         // dòng trên khới tạo kết nối của chính mình
// //         //gọi call on để  nhận được stream từ peer bên kia khi được trả lời
// //         call.on('stream',friendStram => {
// //             playVideo(friendStram, 'friendStream');
// //         })
// //     })
// // })


  

// //Tóm lại :
// // 1: Từ phía request sẽ tạo ra 1 call , truyền vào id của bên cần gọi và kèm theo stream của chính mình
// //    Nếu answer đồng ý => ta được một stream từ phía asnwer(viết code riêng) và để nhận được stream đó ta dùng call.on
// //           call.on('stream',friendStram => {})
// // 2.Từ phía answer sẽ có event peer.on('call',callback) để bắt được request gọi tới và accpect
// //  để accpet : call.answer(stream) lúc này , nếu đồng ý ta đã kết nối , và nếu muốn lấy stream từ peer kìa thì call.on sau đó play
  



// console.log("Xin chao cac ban");



