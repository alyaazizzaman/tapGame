//DEFAULT COLOR: 0f3d15

var game = new Phaser.Game(400, 490, Phaser.AUTO, 'tap-game');

var mainState = { 
        
        preload: preload, 
        create: create, 
        update: update
    };

    game.state.add('main', mainState);  
    game.state.start('main');  

function preload() {

    scaleStage();

    game.load.image('background', 'assets/background.png');
    game.load.image('ground', 'assets/ground.png');
    game.load.image('pipe', 'assets/pipe.png');
    game.load.spritesheet('bird', 'assets/floppy.png', 48, 32);

    //Menu
    game.load.image('pause', 'assets/pause.png');
    game.load.image('restart', 'assets/restart-btn.png');
    game.load.image('highScores', 'assets/high-score-btn.png');
    game.load.image('exit', 'assets/exit-btn.png');
    game.load.image('resume', 'assets/resume-btn.png');

    //Sounds
    game.load.audio('wing', 'assets/sfx_wing.ogg');
    game.load.audio('swoosh', 'assets/sfx_swooshing.ogg');
    game.load.audio('point', 'assets/sfx_point.ogg');
    game.load.audio('die', 'assets/sfx_die.ogg');

}


var scaleRatio = window.devicePixelRatio/3;
function scaleStage(){
    

        game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = true;

        var width = (window.innerWidth > 0) ? window.innerWidth: screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight: screen.height;

        game.scale.minWidth = width;        
        game.scale.minHeight = height;


    var ow = parseInt(game.canvas.style.width,10);
    var oh = parseInt(game.canvas.style.height,10);
    var r = Math.max(window.innerWidth/ow,window.innerHeight/oh);
    var nw = ow*r;var nh = oh*r;
    game.canvas.style.width = nw+"px";
    game.canvas.style.height= nh+"px";
    game.canvas.style.marginLeft = (window.innerWidth/2 - nw/2)+"px";
    game.canvas.style.marginTop = (window.innerHeight/2 - nh/2)+"px";
    document.getElementById("tap-game").style.width = window.innerWidth+"px";
    document.getElementById("tap-game").style.height = window.innerHeight-1+"px";

    // //The css for body includes 1px top margin, I believe this is the cause for this -1
    // document.getElementById("tap-game").style.overflow = "hidden";
}


var player;
var pipe;
var pipes;
var colNum;
var background;
var labelScore;
var score = -1;
var timer;
var ground;
var wingSound;
var swooshSound;
var pointSound;
var dieSound;
var pauseLabel;
var menu;
var resume;
var restart;
var highScores;
var exit;
var gameOver = false;

function create() {

    background = game.add.tileSprite(0, 0, 500, 500, 'background');
    ground = game.add.tileSprite(0, game.height-75, 500, 500, "ground");

    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  Set the world (global) gravity
    game.physics.arcade.gravity.y = 100;

    //  Add a sprite
    // Set the physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    // Display the bird on the screen
    player = game.add.sprite(game.width/2-100, game.height/2, 'bird');
    player.anchor.setTo(-0.2, 0.5); 
    player.animations.add('bird',[0,1,2],10,true);

    // Add gravity to the bird to make it fall
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1000;
    pipes = game.add.group(); // Create a group  
    pipes.enableBody = true;  // Add physics to the group  
    pipes.createMultiple(20, 'pipe'); // Create 20 pipes     
    player.animations.play('right');

    wingSound = game.add.audio('wing');
    swooshSound = game.add.audio('swoosh');
    pointSound = game.add.audio('point');  
    dieSound = game.add.audio('die');

    timer = game.time.events.loop(1500, addRowOfPipes, this);
    labelScore = game.add.text(game.width/2, 20, "0", { font: "30px Arial", fill: "#ffffff" }); 

    //SETUP PAUSE
    pauseLabel = game.add.sprite(game.width - 100, 20, 'pause');
    pauseLabel.inputEnabled = true;
    pauseLabel.events.onInputUp.add(pause);
    // Add a input listener that can help us return from being paused
    game.input.onDown.add(unpause, self);


    //BUILD MENU
    menu = game.add.group();

    var button2 = game.make.button(game.width/2-75, 150, 'restart', restartGame, this, 2, 1, 0, menu);  
    menu.add(button2);
    var button3 = game.make.button(game.width/2-75, 200, 'highScores', goToHighScores, this, 2, 1, 0, menu);
    menu.add(button3);
    var button4 = game.make.button(game.width/2-75, 250, 'exit', exitGame, this, 2, 1, 0, menu);
    menu.add(button4);

    menu.visible = false;

}//END CREATE FUNCTION


function addOnePipe(x, y) {  
    // Get the first dead pipe of our group
    var pipe = pipes.getFirstDead();

    // Set the new position of the pipe
    pipe.reset(x, y);

    // Add velocity to the pipe to make it move left
    pipe.body.velocity.x = -175; 

    // Kill the pipe when it's no longer visible 
    pipe.checkWorldBounds = true;
    pipe.outOfBoundsKill = true;
}

function addRowOfPipes() {  
    // Pick where the hole will be
    var hole = Math.floor(Math.random() * 5) + 1;

    // Add the 6 pipes 
    for (var i = 0; i < 8; i++) {
        if (i != hole && i != hole + 1) {
            addOnePipe(400, i * 60 + 10);
        }
    }


    score += 1;
    if(score > 0){
        labelScore.text = score;
        pointSound.play();
    }
}


function update() {
    if(player.alive){
            ground.tilePosition.x -= 2.8;
    }

    if (player.inWorld == false && gameOver == false)
    {    
        gameOver = true;
        hitPipe();
        showMenu();
    }

    game.physics.arcade.overlap(player, pipes, hitPipe, null, this);

    if (player.angle < 20)  
    player.angle += 1;



    //TAP
    game.input.onTap.add(onTap, this);

    
}



function onTap(pointer) {

        if (player.alive == false)  
        return;

        wingSound.play();

        game.add.tween(player).to({angle: -20}, 100).start(); 
        player.body.velocity.y = -350;
}


function hitPipe() {
    console.log('HIT PIPE');
    // If the bird has already hit a pipe, we have nothing to do
    if (player.alive == false)
        return;

    // Set the alive property of the bird to false
    player.alive = false;
    dieSound.play();

    // Prevent new pipes from appearing
    game.time.events.remove(timer);

    // Go through all the pipes, and stop their movement
    pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);

    //showMenu();

}


function showMenu(){
    console.log("SHOWING MENU");
    console.log(menu);
    menu.visible = true;
}


function pause(){
    game.paused = true;
}
function unpause(){
    game.paused = false;
}





function goToHighScores(){
    console.log('Going to High Scores');
}


// Restart the game
function restartGame(){
    gameOver = false;
    labelScore = 0;
    score = -1;
    game.state.start('main');
}

function exitGame(){
    console.log('Exit Game');
}