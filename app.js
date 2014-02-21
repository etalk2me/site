var app = require('express')();
var path = require('path');
var server = require('http').createServer(app);
var io = require('socket.io').listen(server);
var port = 80;

server.listen(port);
console.log('se conecte na: http://localhost:' + port);

//Public web
app.get('/', function (req, res) {
  res.sendfile(path.join(__dirname, '/index.html'));
});
app.get('/layout2', function (req, res) {
  res.sendfile(path.join(__dirname, '/index2.html'));
});
app.get('/css/*', function(req, res){
  res.sendfile(path.join(__dirname, '/css/', req.params[0]));
});
app.get('/js/*', function(req, res){
  res.sendfile(path.join(__dirname, '/js/', req.params[0]));
});
app.get('/images/*', function(req, res){
  res.sendfile(path.join(__dirname, '/images/', req.params[0]));
});
app.get('/sounds/*', function(req, res){
  res.sendfile(path.join(__dirname, '/sounds/', req.params[0]));
});

var setUserRoom = function(obj){
  rooms.forEach(function (e,i){
    if(e.id == obj.room){
      rooms[i].usersIn.push(obj);
    }
  })
}
var sendMsgToRoom = function (obj){
  rooms.forEach(function (e,i){
    if(e.id == obj.user.room){
      e.usersIn.forEach(function (e2,i2){
        if(e2.id != obj.user.id){
          io.sockets.socket(e2.id).emit('messageToClient', obj.msg);
        }
      });
    }
  })
}
//Sockets
var users = [];
var rooms = [];
var idRoom = 1;
rooms.push(
    {
      id:idRoom,
      name:'Geral',
      description:'Ajustos em geral',
      color1:'#e5717d',
      color2:'#c9636e',
      color3:'#e8828d',
      public: true,
      password: '',
      usersIn:[]
    }
  );

io.sockets.on('connection', function (socket) {
	
    socket.on('message', function (obj) {
        sendMsgToRoom(obj)        
    });

    socket.on('connect', function() {
      var userCoon = {id:this.id, room:1};
      users.push(userCoon);
      setUserRoom(userCoon);
      var nConn = io.rooms[''].length;
    	socket.broadcast.emit('countusers', nConn);
		  socket.emit('countusers', nConn);
      socket.emit('connectUser', userCoon);
    });
	socket.on('disconnect', function() { 
    var nConn = io.rooms[''].length -1;
		socket.broadcast.emit('countusers', nConn);
    socket.emit('countusers', nConn);
	});

});
