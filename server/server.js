const path = require("path");
const fs = require('fs');
const express = require("express");
const http = require('http');
const socketIO = require('socket.io');
var moment = require('moment');
const app = express();
var port = process.env.PORT || 3000;
const publicPath = path.join(__dirname,'../public');
const server = http.createServer(app);
var io = socketIO(server);
const {
        generateMessages,
        generateLocationMessages,
    } = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');
var users = new Users();

app.use(express.static(publicPath));

io.on('connection',function(socket){  
io.emit("activeRooms",users.activeRooms());
    socket.on('join',function(param,callback){
        if(
          (param.join!=="create_room" && isRealString(param.join) && !isRealString(param.room)) || 
          (param.join!=="create_room" && isRealString(param.join) && isRealString(param.room))){
          param.room = param.join;
        }


       if(!isRealString(param.username) || !isRealString(param.room)){
         return callback("Please provide proper values for username and room.");
       }
       var validity = users.validUsername(param.username,param.room);
      if(validity.length > 0){
        return callback("Username is already exists");
      }

      socket.join(param.room);
      users.removeUser(socket.id);
      users.addUser(socket.id,param.username,param.room);

       io.to(param.room).emit("updateUserList",users.getUserList(param.room));
       socket.broadcast.to(param.room).emit('newMessage',generateMessages('admin',`${param.username} is joined`));
       callback();
    });
    socket.emit('newMessage',generateMessages('admin','welcome user'));
    socket.on('createMessage',function(msg,callback){
        var user = users.getUser(socket.id);
        if(user && isRealString(msg.text)){
            io.to(user.room).emit('newMessage',generateMessages(user.username,msg.text));
        }
        callback('Got it');
    });
    socket.on('createLocationMessage',function(coords){
        var user = users.getUser(socket.id);
        
    if(user && coords.latitude && coords.longitude){
        io.to(user.room).emit('newLocationMessage',generateLocationMessages(user.username,coords.latitude,coords.longitude));
    }
        
    });

    socket.on('createWeatherMessage',function(msg){
        io.emit('newWeatherMessage',{
            from:'user',
            createdAt:moment().valueOf(),
            ...msg
        });
   });

  socket.on("user-type",function(params){
    socket.broadcast.emit('user-typing-msg', params.username);
  })

   socket.on('disconnect',function(){

        var user = users.removeUser(socket.id);

        if(user){
            io.to(user.room).emit("updateUserList",users.getUserList(user.room));
            io.to(user.room).emit("newMessage",generateMessages('Admin',`${user.username} is left`));
        }
    
    });

});
server.listen(port,function(){
    console.log(`server is started at the ${port}`);
});
