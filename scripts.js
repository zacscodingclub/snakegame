$(document).ready(function() {
    var canvas = $("#my-canvas")[0];
    var ctx = canvas.getContext('2d');
    var w = $("#my-canvas").width();
    var h = $("#my-canvas").height();
    var cw = 15;
    var speed = 130;
    var snakeArray = [];
    var d = "right";
    var color = "green";
    var food, score;
    
    function init() {
        d = "right";
        createSnake();
        createFood();
        score = 0;

        if(typeof gameLoop != "undefined") clearInterval(gameLoop);
        gameLoop = setInterval(paint, speed);

    };

    init();

    function createSnake(){
        var length = 5;
        for(var i = length-1; i>=0; i--) {
            snakeArray.push({x:i, y:0}); 
        };
    };

    function createFood() {
        // place food object in random location
        food = {
            x:Math.round(Math.random()*(w-cw)/cw),
            y:Math.round(Math.random()*(h-cw)/cw),
        }
    };

    function paint() {
        //paint canvas
        ctx.fillStyle = "black";
        ctx.fillRect(0,0,w,h);
        ctx.strokeStyle = "white";

        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        //track position of head of snake
        if(d == 'right') nx++;
        else if(d == 'left') nx--;
        else if(d == 'up') ny--;
        else if(d == 'down') ny++;

        //checks to see if snake head runs into wall (-1) or the snake and ends the game
        if(nx == -1 || nx == w/cw || ny == -1 ||ny == h/cw || checkCollision(nx, ny, snakeArray)) {
            //init();
            $('#final-score').html(score);
            $('#overlay').fadeIn(300);
            return;
        };


        if(nx == food.x && ny == food.y){
            var tail = {x: nx, y: ny};
            score++; //increment score if runs over food

            createFood();
        } else {
            var tail = snakeArray.pop();
            tail.x = nx; tail.y = ny;
        }

        snakeArray.unshift(tail);

        for(var i=0; i<snakeArray.length;i++) {
            var c = snakeArray[i];
            paintCell(c.x, c.y);
        };

        paintCell(food.x, food.y);

        checkScore(score);

        $('#score').html('Your Score: '+score);
    };

    function paintCell(x,y) {
        ctx.fillStyle = color;
        ctx.fillRect(x*cw,y*cw,cw,cw);
        ctx.strokeStyle="white";
        ctx.strokeRect(x*cw,y*cw,cw,cw);
    };

    function checkCollision(x,y,array) {
        for(var i = 0; i < array.length; i++){
            if(array[i.x == x && array[i].y == y]) return true;
        }
        return false;
    };

    function checkScore(score) {
        if(localStorage.getItem('highscore')=== null) {
            localStorage.setItem('highscore',score);
        } else {
            if (score > localStorage.getItem('highscore')) {
                localStorage.setItem('highscore',score);
            }
        };
        $('#high-score').html('High Score: '+ localStorage.getItem('highscore'));
    };

    $(document).keydown(function(e) {
        var key = e.which;

        if(key == "37" && d != "right") d = "left";
        else if(key == "38" && d != "down") d = "up";
        else if(key == "39" && d != "left") d = "right";
        else if(key == "40" && d != "up") d = "down";

    });
});

function resetScore() {
    localStorage.highscore = 0;

    var highScoreDiv = document.getElementById('high-score');
    highScoreDiv.innerHTML = 'High Score: 0';
};