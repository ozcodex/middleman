let app = require('express')();
let http = require('http').createServer(app);
let io = require('socket.io')(http);

app.get('/',(req,res) => {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', (socket) => {
  socket.on('name', (name) => {
    console.log(name + " is ready to play")
  });
});

http.listen(3000,() => {
  console.log('App running on port 3000');
});
