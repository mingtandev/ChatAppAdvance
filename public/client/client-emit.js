const socket = io();

$('#formMess').submit(function(e) {
    e.preventDefault(); // prevents page reloading
    socket.emit('from-client-chat-mess', $('#mess').val());
    $('#mess').val('');
    return false;
});



socket.on("from-server-chat-mess",function(data){
    var stringAppend = `<li class="contact">
<div class="wrap">
    <span class="contact-status"></span>
    <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="">
    <div class="meta">
        <p class="name">Jonathan Sidwell</p>
        <p class="preview"><span>${data}:</span> ${data} </p>
    </div>
</div>
</li>`

    $('#chatlog').append(stringAppend);
    var objDiv = document.getElementById("messages-log");
    objDiv.scrollTop = objDiv.scrollHeight;
})


socket.on("PRI-from-server-chat-mess",function(data){
    var stringAppend = `<li class="contact">
<div class="wrap">
    <span class="contact-status"></span>
    <img src="http://emilcarlsson.se/assets/jonathansidwell.png" alt="">
    <div class="meta">
        <p class="name">Jonathan Sidwell</p>
        <p class="preview"><span>You:</span> ${data} </p>
    </div>
</div>
</li>`

    $('#chatlog').append(stringAppend);
    var objDiv = document.getElementById("messages-log");
    objDiv.scrollTop = objDiv.scrollHeight;
})