var socket = io();

function create_offer(){
  $('form').empty();
  $('form').append('<label>Barriles a comprar:</label>')
  $('form').append('<input id="amount" type="number" min=0 />')
  $('form').append('<label>Precio por barril:</label>')
  $('form').append('<input id="price" type="number" min=0 max=10 />')
  $('form').append('<button id="send_offer">Enviar Oferta</button>')

  $('#send_offer').click( (e) => {
    let outgoing = {
      amount : $('#amount').val(),
      price : $('#price').val()
    }
    socket.emit('offer',outgoing)
  });
}

function should_show_offer_form(data){
  let is_offer_phase = data.phase == 0 || data.phase == 2
 return data.turn >= 1 && is_offer_phase
}

$('form').submit((e) => {
  e.preventDefault();
  return false;
});
$(".a_sel").click((e)=>{
  target = $(e.target)
  target.prop("disabled",true)
  value = target.val();
  $('#num_a').val(($('#num_a').val() + value +","));
});
$(".b_sel").click((e)=>{
  target = $(e.target)
  target.prop("disabled",true)
  value = target.val();
  $('#num_b').val(($('#num_b').val() + value +","));
});
$('#conn').click(() => {
  outgoing = {
    name: $('#name').val(),
    num_a: $('#num_a').val(),
    num_b: $('#num_b').val()
  }
  socket.emit('join_game',outgoing );
  $('#play').prop("disabled",false);
  $('#conn').prop("disabled",true);
  return;
});
$('#play').click(() => {
  socket.emit('start');
  return;
});
socket.on('players_info', (players) => {
  $('#players').empty();
  
  if(Object.keys(players).length === 0)
    $('#players').append( $('<li>').text("No hay jugadores conectados") );
  for(id in players){
    let name = players[id]['name']
    let num_a = players[id]['num_a']
    $('#players').append( $('<li>').text(name + ":" + num_a ) )
  }
  return;
});
socket.on('data',(data)=>{
  console.log(socket.id)
  console.log(data)
  if (should_show_offer_form(data)){
    create_offer();
    $('#status').text('Juego en Progreso');
    $('#cash').text(data.players[socket.id]['cash'])
  }
});
