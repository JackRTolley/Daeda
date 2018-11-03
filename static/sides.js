

function range(start, end) {
    return (new Array(end - start + 1)).fill(undefined).map((_, i) => i + start);
}

export class Sides{

    constructor(context, canvas){
        this.context = context;
        this.canvas = canvas;

        this.ileft_death = {
            'colour' : 'none',
            'timing' : 0
        }
        this.iright_death = {
            'colour' : 'none',
            'timing' : 0
        }
    }
    left_death(colour = this.ileft_death.colour){
        if (colour != this.ileft_death.colour){
            this.ileft_death = {
                'colour' : colour,
                'timing' : 100
            }
        }
        else if(this.ileft_death.timing == 0){
            this.ileft_death.colour = 'none';
        }
        else if (colour == this.ileft_death.colour){
            
            this.ileft_death.timing -= 1;
        }
        if(this.ileft_death.colour != 'none'){
            var ctx = this.context;
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.moveTo(0,0);
            for(var i in range(0, 20)){
                ctx.lineTo(50, i * 2 * (this.canvas.height/40));
                ctx.lineTo(0, (i * 2 + 1) * (this.canvas.height/40 ));
            }
            ctx.fill();
        }
    }

    right_death(colour = this.iright_death.colour){
        if (colour != this.iright_death.colour){
            this.iright_death = {
                'colour' : colour,
                'timing' : 100
            }
        }
        else if(this.iright_death.timing == 0){
            this.iright_death.colour = 'none';
        }
        else if (colour == this.iright_death.colour){
            
            this.iright_death.timing -= 1;
        }
        if(this.iright_death.colour != 'none'){
            var ctx = this.context;
            ctx.fillStyle = colour;
            ctx.beginPath();
            ctx.moveTo(this.canvas.width,0);
            for(var i in range(0, 20)){
                ctx.lineTo(this.canvas.width - 50, i * 2 * (this.canvas.height/40));
                ctx.lineTo(this.canvas.width, (i * 2 + 1) * (this.canvas.height/40 ));
            }
            ctx.fill();
        }

    }


}