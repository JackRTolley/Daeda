

export function draw_player(player, context){
    var player_size = 10;
    var default_start = -1/8 * Math.PI
    var seg_add = 1/4 * Math.PI
    // Draw Body
    context.fillStyle = 'black';
    context.beginPath();
    context.arc(player.x, player.y, player_size, 0, 2 * Math.PI);
    context.fill();

    // Draw Arms
    context.fillStyle = 'red';

    for(var i in range(0,4)){
        context.beginPath();
        context.arc(
            player.x, player.y, player_size,
            (default_start + 2*i*seg_add) + player.spin,
            default_start + (((2*i)+1)*seg_add)+ player.spin)
        context.lineTo(
            player.x + (1.87 * player_size * Math.cos(player.spin + (i * Math.PI * 0.5) )),
            player.y + (1.87 * player_size)* Math.sin(player.spin + (i * Math.PI * 0.5) ));
        context.arc(
            player.x, player.y, player_size,
            (default_start + 2*i*seg_add + player.spin),
            default_start + (((2*i)+1)*seg_add) + player.spin)
        context.fill();
    }
}

function range(start, end) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}

