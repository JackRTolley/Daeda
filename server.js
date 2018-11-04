// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');
var app = express();
var server = http.Server(app);
var io = socketIO(server);
app.set('port', 8080);
app.use('/static', express.static(__dirname + '/static'));
// Routing
app.get('/', function(request, response) {
  response.sendFile(path.join(__dirname, 'index.html'));
});
// Starts the server.
server.listen(8080, function() {
  console.log('Starting server on port 8080');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

var players = {};
var player_count = 0;
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      socket_id: socket.id,
      id: player_count,
      x: 450,
      y: 450,
      spin: 0,
      speed: 0,
      spin_speed: 0,
      force_x: 0,
      force_y: 0,
    };
    player_count++;
  });
  socket.on('disconnect', function(){
    delete players[socket.id];
  })
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.up) {
      player.speed += 5;
    }
    if (data.left) {
      player.spin_speed -= 0.05 * Math.PI;
    }  
    if (data.right) {
      player.spin_speed += 0.05 * Math.PI;
    }
  });
  socket.on('collision', function(id){
    var unicorn = players[id.unicorn];
    var victim  = players[id.victim];

    var spin_speed_mod = 10;
    var speed_mod = 0.1;
    var abs_x = Math.abs(unicorn.x - victim.x);
    var abs_y = Math.abs(unicorn.y - victim.y);
    var angle = Math.atan(abs_x/abs_y) * Math.PI;
    var angle_mod = angle/5;

    force = (unicorn.speed * angle_mod * speed_mod) + (unicorn.spin * spin_speed_mod);
    victim.force_x = force * Math.sin(angle);
    victim.force_y = force * Math.cos(angle);
    unicorn.speed = 0;
  })
  socket.on('kill', function(id){
    console.log("Player died: " + id);
    delete players[id];
  })
});
setInterval(function() {
  io.sockets.emit('state', players);
  for(var id in players){
    players[id] = cal_force(players[id]);
  }
}, 1000 / 30);

function cal_force(player){
  // New Spin
  player.spin += player.spin_speed;
  player.spin %= 2*Math.PI;
  player.spin_speed *= 0.3;
  // New Speed
  player.x += player.speed * Math.sin(player.spin + (Math.PI * 0.5));
  player.y += player.speed * Math.cos(player.spin - (Math.PI * 0.5));
  player.speed *= 0.8;
  // Being hit
  player.x += player.force_x;
  player.y += player.force_y;

  player.force_x *= 0.9;
  player.force_y *= 0.9;

  return player
}