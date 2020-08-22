let express = require('express');
let app = express() 
let http = require('http').createServer(app);
let io = require('socket.io')(http);

// Express Config
app.use(express.static('public'))
app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});

//Gama Data
var data = {
  players : {},
  turn : 0,
  phase : 0,
  initial_money: 0
}

/* Phases:
 * 0 - players are offering to buy
 * 1 - all players offered and bought
 * 2 - players are offering to sell
 * 3 - all players offered and sold
*/

function calculate(){
  data.turn = 1;
  n = Object.keys(data.players).length;
  data['initial_money'] = 10 * n;
  populate_initial_data()
}

function populate_initial_data(){
  for(id in data.players){
    data.players[id]['cash'] = data['initial_money']
    data.players[id]['stock'] = 0
  }
}



io.on('connection', (socket) => {
  
  io.emit('players_info', data.players);
  io.emit('data',data)

/* Player data structure
 * 
 * name String
 * num_a Array Number
 * num_b Array Number
 * cash Number
 * stock Number
 * buy_offers Array Object
 *   amount Number
 *   price Number
 *   bought Number
 * sell_offers Array Object
 *   amount Number
 *   price Number
 *   sold Number
 */

  socket.on('join_game', (player_data) => {
    data.players[socket.id] = {}
    data.players[socket.id]['name'] = player_data.name
    data.players[socket.id]['num_a'] = player_data.num_a
    data.players[socket.id]['num_b'] = player_data.num_b
    data.players[socket.id]['cash']= 0
    data.players[socket.id]['stock'] = 0
    data.players[socket.id]['buy_offers'] = []
    data.players[socket.id]['sell_offers'] = []
    io.emit('players_info', data.players);
  });

  socket.on('start', ()=> {
    calculate();
    io.emit('data',data);
  });

  socket.on('offer', (player_offer)=> {
    turn = data['turn']
    data.players[socket.id]['buy_offers'][turn - 1] = player_offer
    io.emit('data',data);
  })

  socket.on('disconnect', () => {
    delete data.players[socket.id]
    io.emit('players_info', data.players);
  });

});

http.listen(3000,() => {
  console.log('App running on port 3000');
});
