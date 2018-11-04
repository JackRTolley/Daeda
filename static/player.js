export class Player{

    constructor(data){ 
        // Player specific qualities
        this.socket_id = data.socket_id;
        this.id = data.id;
        this.x = data.x;
        this.y = data.y;
        this.spin = data.spin;
        // Universial qualities
        this.size = 10;
        this.color = rainbow(this.id, 30);
        this.ignore = {}
    }

    draw(canvas, context){   
        // Get Canvas and Context
        
        // Draw body
        context.fillStyle = 'black';
        context.beginPath();
        context.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        context.fill();
        // Draw horn
        context.fillStyle = this.color;
        context.beginPath();
        context.arc(this.x, this.y, this.size, (Math.PI/-6) + this.spin, (Math.PI/6) + this.spin);
        context.lineTo(
            this.x + (2.5 * this.size * Math.sin(this.spin + (Math.PI * 0.5))),
            this.y + (2.5 * -
                this.size * Math.cos(this.spin + (Math.PI * 0.5))));
        context.arc(this.x, this.y, this.size, Math.PI/-6 + this.spin, Math.PI/6 + this.spin);
        context.fill();
    }

    detect_collisions(client_players){

        for(var id in client_players){
            if(client_players[id] != this && !(id in this.ignore)){
                var other = client_players[id];
                var new_x = this.x + (2.5 * this.size * Math.sin(this.spin + (Math.PI * 0.5)));
                var new_y = this.y + (2.5 * -this.size * Math.cos(this.spin + (Math.PI * 0.5)));

                var onx = other.x - new_x;
                var ony = other.y - new_y;
                
                if(Math.pow(onx, 2) + Math.pow(ony,2) < Math.pow(this.size,2)){
                    this.collide(id);
                    other.ignore[id] = 100;
                    this.ignore[id] = 100;
                }
            }
        }

        // Decrement ignores
        for(var id in this.ignore){
            this.ignore[id]--;
            if(this.ignore[id] == 0){delete this.ignore[id];}
        }
    }

    collide(id){
        var socket = io();
        console.log("Collision detected!");
        socket.emit("collision", {'unicorn': this.socket_id,'victim': id});
    }

}

function rainbow(numOfSteps, step) {
    // This function generates vibrant, "evenly spaced" colours (i.e. no clustering). This is ideal for creating easily distinguishable vibrant markers in Google Maps and other apps.
    // Adam Cole, 2011-Sept-14
    // HSV to RBG adapted from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
    var r, g, b;
    var h = step / numOfSteps;
    var i = ~~(h * 6);
    var f = h * 6 - i;
    var q = 1 - f;
    switch(i % 6){
        case 0: r = 1; g = f; b = 0; break;
        case 1: r = q; g = 1; b = 0; break;
        case 2: r = 0; g = 1; b = f; break;
        case 3: r = 0; g = q; b = 1; break;
        case 4: r = f; g = 0; b = 1; break;
        case 5: r = 1; g = 0; b = q; break;
    }
    var c = "#" + ("00" + (~ ~(r * 255)).toString(16)).slice(-2) + ("00" + (~ ~(g * 255)).toString(16)).slice(-2) + ("00" + (~ ~(b * 255)).toString(16)).slice(-2);
    return (c);
}







