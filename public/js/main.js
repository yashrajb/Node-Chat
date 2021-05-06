var socket = io();
var params = jQuery.deparam(window.location.search);
socket.on('connect',function(){
    params.room = params.room.toLowerCase();
    socket.emit('join',params,function(err){
        if(err){
            alert(err);
            window.location.href = "/";
        }
    });
});
socket.on('disconnect',function(){
    console.log('disconnected');
});
jQuery('#message-form').submit(function(e){
e.preventDefault();
var from = 'admin';
var text = jQuery("input[name='message']").val();
    socket.emit('createMessage',{
        from,
        text,
        createdAt:new Date().getTime()
    },function(ack){
        jQuery("input[name='message']").val('');
    });
});

 
function scrollToBottom(){
    var messages = jQuery("#all-messages");
    var newMessage = messages.children("li:last-child");
    var clientHeight = messages.prop("clientHeight");
    var scrollTop = messages.prop("scrollTop");
    var scrollHeight = messages.prop("scrollHeight");
    var newMessageHeight = newMessage.innerHeight();
    var prevMessage = newMessage.prev().innerHeight();
    if(clientHeight+scrollTop+newMessageHeight+prevMessage >= scrollHeight){
        messages.scrollTop(scrollHeight);
    }
}


jQuery('#send-loc').click(function(){
    if(!navigator.geolocation){
        return alert("Hey your browser not supports the geolocation")
    }
    jQuery('#send-loc').attr("disabled",true).text('Sending Location....');
    navigator.geolocation.getCurrentPosition(function(positions){
        jQuery('#send-loc').attr("disabled",true).text('Send Location');
        var coords = {
            latitude:positions.coords.latitude,
            longitude:positions.coords.longitude
        }
        socket.emit('createLocationMessage',coords);
        
    }, function(){
        jQuery('#send-loc').removeAttr("disabled",true).text("Send Location");
    });

});



socket.on('newMessage',function(msg){

    $(".user-typing").text("");
    var formatedTime =  moment(msg.createdAt).format('h:mm a');
    var template = jQuery("#message-template").html();
    var html = Mustache.render(template,{
        text:msg.text,
        createdAt:formatedTime,
        from:msg.from
    });
 $('#all-messages').append(html);
 scrollToBottom();
});

socket.on('updateUserList',function(users){
    var ol = jQuery("<ol></ol>");

    users.forEach(function(user){
        ol.append(jQuery("<li></li>").text(user));
    });

    jQuery("#users").html(ol)
});


socket.on('newLocationMessage',function(msg){
    
    var formatedTime =  moment(msg.createdAt).format('h:mm a');
    var template = jQuery("#location-message-template").html();
    var html = Mustache.render(template,{
        url:msg.url,
        createdAt:formatedTime,
        from:msg.from
    });
    $('#all-messages').append(html);
    jQuery('#send-loc').removeAttr("disabled");
    scrollToBottom();
});



jQuery('#send-weath').click(function(){

    if(!navigator.geolocation){
        return alert("Hey your browser not supports the geolocation")
    }
    jQuery('#send-weath').attr("disabled",true).text('Sending Weather....');
    navigator.geolocation.getCurrentPosition(function(positions){
        var lat = positions.coords.latitude;
        var lon = positions.coords.longitude;
        axios.get(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=XXXXXXXXXXXXX`)
        .then(function(response){
            socket.emit('createWeatherMessage',{
                main:response.data.weather[0].main,
                description:response.data.weather[0].description
            });
        });
    },function(){
        $('#send-weath').removeAttr("disabled").text("Send Weather");
    });
});

socket.on('newWeatherMessage',function(msg){
    var formatedTime =  moment(msg.createdAt).format('h:mm a');
    var template = jQuery("#weather-message-template").html();
    var html = Mustache.render(template,{
        main:msg.main,
        description:msg.description,
        createdAt:formatedTime,
        from:msg.from
    });
    $("#all-messages").append(html);
    $("#send-weath").removeAttr("disabled").text("Send Weather");
    scrollToBottom();
});



var msgInput = jQuery("input[name='message']")[0];
msgInput.addEventListener("keypress",function(){
    socket.emit("user-type",params);
});

socket.on('user-typing-msg',function(msg){
        $(".user-typing").html(`${msg} is typing....`);
 });






