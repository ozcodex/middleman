let express = require('express');
let app = express() 
let http = require('http').createServer(app);
let io = require('socket.io')(http);

// Express Config
app.use(express.static('public'))
app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});


var players = {};
var data = {
  status : 0,
  initial_money: 0
}

function calculate(){
  data.status = 1;
  n = Object.keys(players).length;
  data['initial_money'] = 10 * n;
}



io.on('connection', (socket) => {
  
  io.emit('players_info', players);
  io.emit('data',data)

  socket.on('join_game', (player_data) => {
    players[socket.id] = {}
    players[socket.id]['name']= player_data.name
    players[socket.id]['num_a']= player_data.num_a
    players[socket.id]['num_b']= player_data.num_b
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
