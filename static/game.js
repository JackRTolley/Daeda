import {Player} from './Player.js'

var socket = io();
var movement = {
    up: false,
    left: false,
    right: false
  }
  document.addEventListener('keydown', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = true;
        break;
      case 87: // W
        movement.up = true;
        break;
      case 68: // D
        movement.right = true;
        break;
    }
  });
  document.addEventListener('keyup', function(event) {
    switch (event.keyCode) {
      case 65: // A
        movement.left = false;
        break;
      case 87: // W
        movement.up = false;
        break;
      case 68: // D
        movement.right = false;
        break;
    }
  });

//Send notification that player has connected
socket.emit('new player');
//Send movement data
setInterval(function() {
  socket.emit('movement', movement);
}, 1000 / 30);
//Update Canvas
var canvas = document.getElementById('canvas');
canvas.width = 800;
canvas.height = 600;
var context = canvas.getContext('2d');
var client_players = {};
var canvas = document.getElementById('canvas');
canvas.height = 800;
canvas.width = 600;
var context = canvas.getContext("2d")
socket.on('state', function(players) {

  context.clearRect(0, 0, 800, 600);
  for (var id in players) {
    if(!(id in client_players)){   
      client_players[id] = new Player(players[id]);
      //console.log("Clients: " + client_players)
    }
    else{
      var p = players[id];
      var c = client_players[id];
      c.x = p.x;
      c.y = p.y;
      c.spin = p.spin;
    }
  }
  for(var id in client_players){
    if(!(id in players)){
      delete client_players[id];
    }
    client_players[id].draw(canvas, context);
    client_players[id].detect_collisions(client_players);
  }
});




