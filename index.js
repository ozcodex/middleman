let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

var players = {};
var data = {
  status : 0
}

function calculate(){
  data.status = 1;
  n = Object.keys(players).length;
  data['initial_money'] = 10 * n;
}

app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  
  io.emit('players_info', players);
  io.emit('data',data)

  socket.on('name', (name) => {
    players[socket.id] = name
    io.emit('players_info', players);
  });

  socket.on('start', ()=> {
    calculate();
    io.emit('data',data);
  });

  socket.on('disconnect', () => {
    delete players[socket.id]
    io.emit('players_info', players);
  });

});

http.listen(3000,() => {
  console.log('App running on port 3000');
});
