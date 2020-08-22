var socket = io();

function create_offer(){
  $('form').empty();
  $('form').append('<label>Barriles a comprar:</label>')
  $('form').append('<input id="amount" type="number" min=0 />')
  $('form').append('<label>Precio por barril:</label>')
  $('form').append('<input id="offer" type="number" min=0 max=10 />')
  $('form').append('<button>Enviar Oferta</button>')
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
  outcoming = {
    name: $('#name').val(),
    num_a: $('#num_a').val(),
    num_b: $('#num_b').val()
  }
  socket.emit('join_game',outcoming );
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
  if (data.status === 1 ){
    create_offer();
    $('#status').text('Juego en Progreso');
    $('#cash').text(data.initial_money)
  }
});
