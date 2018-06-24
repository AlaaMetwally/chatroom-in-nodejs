var connect = require('connect');
var express=require('express');
var app=express();
app.set('view engine','ejs');
var server=require('http').createServer(app);
var io=require('socket.io').listen(server);
users=[];
connections=[];
server.listen(process.env.PORT || 3000);
app.get('/',function(req,res){
    res.render('index',{title:"HELLO"});
})
io.sockets.on('connection',function(socket){
    connections.push(socket);
    socket.on('disconnect',function(data){
        users.splice(users.indexOf(socket.username),1);
        updateUsernames();
        connections.splice(connections.indexOf(socket),1)
    })
    socket.on('chat',function(data){
        io.sockets.emit('new',{msg:data,user:socket.username})
    })
    socket.on('new user',function(data,callback){
callback(true);
socket.username=data;
users.push(socket.username);
updateUsernames();
    })
    function updateUsernames(){
        io.sockets.emit('get users',users);
    }
})