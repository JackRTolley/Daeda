import {Player} from "./oldplayer.js"
import {Sides} from './oldsides.js'

var canvas = document.getElementById('canvas');
canvas.width = 1080;
canvas.height = 600;
var context = canvas.getContext('2d');
var now = new Date().getTime();
var msides = new Sides(context, canvas);

var players = {};
document.addEventListener('keydown', function(event) {
    var player0 = players[0]
    var player1 = players[1]
    switch (event.keyCode) {  
        case 68: // D     
        player0.point(0);
        break;
        case 83: // S
        player0.point(1);
        break
        case 65: // A       
        player0.point(2);
        break;
        case 87: // W      
        player0.point(3);
        break;
        case 37:// left
        player1.point(2);
        break; 
        case 38://up
        player1.point(1);
        break; 
        case 39://right
        player1.point(0);
        break; 
        case 40://down
        player1.point(3);
        break; 
        case 32:
        for(var player in players){
            player = players[player]
            player.spawn()
        }
        break;
    }
});

setInterval(function() { 
    context.clearRect(0, 0, canvas.width, canvas.height);
    msides.left_death();
    msides.right_death();
    var delta_time = new Date().getTime() - now;
    for (var id in players) {
        var player = players[id];
        player.apply_force(delta_time/1000);
        player.draw();
    }
    now = new Date().getTime();
    players[0].check_collision(players[1])
    players[1].check_collision(players[0])
}, 1000 / 60);

var colour_list = [
    ['#bfbfbf', '#808080', '#4040400', '#000000'], //black
    ['#ff9980', ' #ff5c33', '#e62e00', '#991f00'] //red
]
var player_count = 0
function create_player(){
    players[player_count] = new Player(player_count, context, canvas, msides, colour_list[player_count])
    console.log(players)
    player_count++;

}

create_player();
create_player();