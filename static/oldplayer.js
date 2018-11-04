


function range(start, end) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}

export class Player{

    constructor(id, context, canvas, sides, colours){
        this.id = id;
        this.context = context;
        this.canvas = canvas;
        this.x = 0
        this.y = 0
        this.sides = sides
        this.x_a = 0 //x accerleration
        this.y_a = 0 //y accerleration
        this.spin = 0
        this.spin_a = 0
        // default variables
        this.player_size = 10;
        this.boost = 500;
        this.max_x = 1000;
        this.max_y = 1000;
        this.entropy = 20;
        this.no_collide = 30;
        this.dead = true;
        this.colours = colours;
        // Score variables
        this.score = 0;
        this.last_touch = null;

    }

    draw(){
        if(!this.dead){
        var default_start = -1/8 * Math.PI
        var seg_add = 1/4 * Math.PI

        // Draw Body
        this.context.fillStyle = 'black';
        this.context.beginPath();
        this.context.arc(this.x, this.y, this.player_size, 0, 2 * Math.PI);
        this.context.fill();

        // Draw Arms
        this.context.fillStyle = this.colours[0];

        for(var i in range(0,4)){
            this.context.beginPath();
            this.context.arc(
                this.x, this.y, this.player_size,
                (default_start + 2*i*seg_add) + this.spin,
                default_start + (((2*i)+1)*seg_add)+ this.spin)
                this.context.lineTo(
                this.x + (1.87 * this.player_size * Math.cos(this.spin + (i * Math.PI * 0.5) )),
                this.y + (1.87 * this.player_size)* Math.sin(this.spin + (i * Math.PI * 0.5) ));
                this.context.arc(
                this.x, this.y, this.player_size,
                (default_start + 2*i*seg_add + this.spin),
                default_start + (((2*i)+1)*seg_add) + this.spin)
                this.context.fill();
        }
        }
    }

    point(i){
        this.x_a += this.boost *Math.cos(this.spin + (Math.PI * i * 0.5));
        this.y_a += this.boost * Math.sin(this.spin + (Math.PI * i * 0.5));
        this.spin_a += 0.05 * Math.PI
    }

    apply_force(delta_time){
        
        // Apply acceleration
        this.x += this.x_a * delta_time;
        this.y += this.y_a * delta_time;
        //this.spin += this.spin_a

        // Apply decelaration affects
        if(0 < this.x_a && this.x_a < 1){this.x_a = 0;} // Avoid weird under 1 errors
        else if(this.x_a < 0){ // Apply left force
            this.x_a += Math.sqrt(-1 * this.x_a) * this.entropy * delta_time
            if(this.x_a < -1000){this.x_a = -1000;}
        }
        else if(this.x_a > 1){ // Apply right force
            if(this.x_a > 1000){this.x_a = 1000;};
            this.x_a -= Math.sqrt(this.x_a) * this.entropy * delta_time;
        }
        // Apply forces for y
        if(0 < this.y_a && this.y_a < 1){this.y_a = 0;}  // Avoid weird under 1
        else if(this.y_a < 0){ // Apply up
            this.y_a += Math.sqrt(-1 * this.y_a) * this.entropy * delta_time
        }
        else if(this.y_a > 1){ // Apply down
            this.y_a -= Math.sqrt(this.y_a) * this.entropy * delta_time;
        }    

        // Decelarate spin
        this.spin_a -= this.spin_a * delta_time * 10

        // Apply gravity
        this.y_a += 10

        // If player hits floor, stop momentum
        if(this.y > (canvas.height -
            (this.player_size * (1.3 + (0.5 * Math.sin(this.spin)))))){
            this.y_a = 0;
            this.y = canvas.height -
            (this.player_size * (1.3 + (0.5 * Math.sin(this.spin))));
        }

        // If player hits sides, stop them
        if(this.x < 0 || this.x > this.canvas.width && !this.dead){
            this.x_a = 0;
            if(this.x < 0){this.sides.left_death(this.colours[0]);}
            else if(this.x > this.canvas.width){this.sides.right_death(this.colours[0]);}

            if(this.last_touch != null){this.last_touch.score++;}
            this.kill();
            console.log("Score: " + this.score);
        }
    }
    check_collision(other){

        if(!this.dead && !other.dead){
        var angle = (this.spin - other.spin) * 2;

        if(this.no_collide > 0){
            this.no_collide -= 1;
        }
        else if(other.no_collide > 0){
            other.no_collide -= 1;
        }

        else if(Math.abs(this.x - other.x) < (36 - Math.abs(8* Math.sin(angle)))) {
            if(Math.abs(this.y - other.y) < (36-Math.abs(8*Math.sin(angle))))
            {   
                this.no_collide = 30;
                var temp = this.x_a;
                this.x_a = other.x_a * 0.9;
                other.x_a = temp * 0.9;
                
                temp = this.y_a;
                this.y_a = other.y_a * 0.9;
                other.y_a = temp;

                this.last_touch = other;
                other.last_touch = this;
                         
            }         
        }
        }
    }

    spawn(){
        this.dead = false;
        this.x = 50;
        this.y = 50;
    }

    kill(){
        this.dead = true;
        this.last_touch = null;

    }
}