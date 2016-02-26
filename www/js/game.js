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

    //sounds
    //game.load.audio('jump', 'assets/jump.wav');

}


var scaleRatio = window.devicePixelRatio/3;
function scaleStage(){
    

        game.input.maxPointers = 1;
        game.stage.disableVisibilityChange = true;

        // if (game.device.desktop)
        // {
        //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //     game.scale.setMinMax(260, 480, 768, 1024);
        //     game.scale.pageAlignHorizontally = true;
        //     game.scale.pageAlignVertically = true;
        // }
        // else
        // {
        //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        //     game.scale.setMinMax(260, 480, 768, 1024);
        //     game.scale.pageAlignHorizontally = true;
        //     game.scale.pageAlignVertically = true;
        //     game.scale.forceOrientation(false, true);
        //     game.scale.setResizeCallback(game.gameResized, game);
        //     game.scale.enterIncorrectOrientation.add(game.enterIncorrectOrientation, game);
        //     game.scale.leaveIncorrectOrientation.add(game.leaveIncorrectOrientation, game);
        // }


    // if (game.device.desktop)        
    // {
        //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;            
        // game.scale.minWidth = window.innerWidth;        
        // game.scale.minHeight = window.innerHeight;

        var width = (window.innerWidth > 0) ? window.innerWidth: screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight: screen.height;

        game.scale.minWidth = width;        
        game.scale.minHeight = height;
                    
        // game.scale.maxWidth = window.innerWidth * window.devicePixelRatio; //game.width;            
        // game.scale.maxHeight = window.innerHeight * window.devicePixelRatio;//game.height;            
        // game.scale.pageAlignHorizontally = true;            
        // game.scale.pageAlignVertically = true;
        // scaleRatio = window.devicePixelRatio;    
        //game.scale.setScreenSize(true);       
    // } else {
    //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //     game.scale.minWidth = 400;
    //     game.scale.minHeight = 490;
    //     game.scale.maxWidth = 1334;
    //     game.scale.maxHeight = 750;
    //     game.scale.forceLandscape = false;
    //     game.scale.pageAlignHorizontally = false;
    //     var scaleRatio = window.devicePixelRatio/2;
    // }


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
var jumpSound;
var ground;

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

    // Add gravity to the bird to make it fall
    game.physics.arcade.enable(player);
    player.body.gravity.y = 1000;
    pipes = game.add.group(); // Create a group  
    pipes.enableBody = true;  // Add physics to the group  
    pipes.createMultiple(20, 'pipe'); // Create 20 pipes     
    player.animations.play('right');

    //jumpSound = game.add.audio('jump');  


    timer = game.time.events.loop(1500, addRowOfPipes, this);
    labelScore = game.add.text(game.width/2, 20, "0", { font: "30px Arial", fill: "#ffffff" }); 

}

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
    }
}


function update() {
    console.log(ground);
    ground.tilePosition.x -= 2.8;

    game.physics.arcade.overlap(player, pipes, restartGame, null, this);

    if (player.angle < 20)  
    player.angle += 1;

     if (player.inWorld == false)
        restartGame();

    //TAP
    game.input.onTap.add(onTap, this);
}



function onTap(pointer) {

        if (player.alive == false)  
        return;

        //jumpSound.play();  

        game.add.tween(player).to({angle: -20}, 100).start(); 
        player.body.velocity.y = -350;
}

function hitPipe() {  
    // If the bird has already hit a pipe, we have nothing to do
    if (player.alive == false)
        return;

    // Set the alive property of the bird to false
    player.alive = false;

    // Prevent new pipes from appearing
    game.time.events.remove(timer);

    // Go through all the pipes, and stop their movement
    this.pipes.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);
}


// Restart the game
function restartGame(){ 
    labelScore = 0;
    score = -1;
    game.state.start('main');
}