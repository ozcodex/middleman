let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

var players = {};
var data = {
  status : 0
}

app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  
  io.emit('players_info', players);
  io.emit('data',data)

  socket.on('name', (name) => {
    console.log(name + " is ready to play")
    players[socket.id] = name
    io.emit('players_info', players);
  });

  socket.on('start', ()=> {
    data.status = 1;
    io.emit('data',data);
  });

  socket.on('disconnect', () => {
    console.log('user disconnected');
    delete players[socket.id]
    io.emit('players_info', players);
  });

});

http.listen(3000,() => {
  console.log('App running on port 3000');
});
