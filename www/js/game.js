

var player;
var walls;
var background;
var labelScore;
var score = 0;
var wallTimer;

var wingSound;
var swooshSound;
var scoreSound;
var dieSound;
var pauseLabel;
var menu;
var resume;
var restart;
var highScores;
var exit;
var gameOver = false;
var scaleRatio;
var background;

//GAME VARIABLES
var GRAVITY = 70;
var OPENING = 140;
var SPAWN_RATE = 1.50;
var SPEED = 150;



var game = new Phaser.Game(320, 460, Phaser.AUTO, 'tap-game');

//Setup our games main state, this is the base functionality structure
//for phaser. Each "level" will go through this process of
//preload, create, update, render...
// **Note that the render function is for displaying debugging information
//so we don't need it
var mainState = { 
        
        preload: preload, 
        create: create, 
        update: update
        //render: render
    };

    game.state.add('main', mainState);  
    game.state.start('main');  


//Our preload handles gathering and loading our assets that we will
//use in the game.
//For our purpose, we call scaleStage immediately to dynamically 
//set the screen resolution. Phaser doesn't have a good way to handle
//mobile resolutions so this is a giant hack.
function preload() {

    scaleStage();

    //Load World assets
    game.load.image('background', 'assets/background.png');
    //game.load.image('pipe', 'assets/pipe.png');
    game.load.image('column', 'assets/column.png');

    //Load Player assets
    game.load.spritesheet('bird', 'assets/floppy.png', 36, 24);

    //Load Menu assets
    game.load.spritesheet('pause', 'assets/pause.png', 32,32);
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


//Use the scaleRatio to change the scaling of our sprites
var scaleRatio = window.devicePixelRatio/2;

//Scale Stage finds the window size and adjusts accordingly depending
//on the resolution of the device we are displaying on.
function scaleStage(){
    
        // game.stage.disableVisibilityChange = true;

        // var width = (window.innerWidth > 0) ? window.innerWidth: screen.width;
        // var height = (window.innerHeight > 0) ? window.innerHeight: screen.height;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.pageAlignHorizontally = true;            
        // game.scale.pageAlignVertically = true;
        // game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        // game.scale.width = width;
        // game.scale.height = height;



        game.stage.disableVisibilityChange = true;

        var width = (window.innerWidth > 0) ? window.innerWidth: screen.width;
        var height = (window.innerHeight > 0) ? window.innerHeight: screen.height;


    // if (game.device.desktop)        
    // {
    //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //     game.scale.pageAlignHorizontally = true;            
    //     game.scale.pageAlignVertically = true;
    //     game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
    //     game.scale.width = width;
    //     game.scale.height = height;
        
    // } else {
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.minWidth = 480;
        game.scale.minHeight = 260;
        game.scale.maxWidth = 1334;
        game.scale.maxHeight = 750;
        game.scale.width = width;
        game.scale.height = height;

        game.scale.forceLandscape = true;
        //game.scale.pageAlignHorizontally = true;
        game.scale.pageAlignVertically = true;
    // }

    // var ow = parseInt(game.canvas.style.width,10);
    // var oh = parseInt(game.canvas.style.height,10);
    // var r = Math.max(window.innerWidth/ow,window.innerHeight/oh);
    // var nw = ow*r;var nh = oh*r;
    // game.canvas.style.width = nw+"px";
    // game.canvas.style.height= nh+"px";
    // game.canvas.style.marginLeft = (window.innerWidth/2 - nw/2)+"px";
    // game.canvas.style.marginTop = (window.innerHeight/2 - nh/2)+"px";
    // document.getElementById("tap-game").style.width = window.innerWidth+"px";
    // document.getElementById("tap-game").style.height = window.innerHeight-1+"px";

    // //The css for body includes 1px top margin, I believe this is the cause for this -1
    // document.getElementById("tap-game").style.overflow = "hidden";



}


function create() {

    //Setup world assets and functionality
    game.input.maxPointers = 1;
    background = game.add.tileSprite(0,0,this.world.width, this.world.height, "background");
    background = game.add.tileSprite(0,0,this.world.width, this.world.height, "background");
    


    walls = game.add.group();
    //pipes = game.add.group(); // Create a group  
    //pipes.enableBody = true;  // Add physics to the group  
    //pipes.createMultiple(20, 'pipe'); // Create 20 pipes    

    //Set up world physics - using arcade
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.physics.arcade.gravity.y = GRAVITY; //  Set the world (global) gravity   
    game.physics.startSystem(Phaser.Physics.ARCADE); // Set the physics system


    //Setup Player
    player = game.add.sprite(game.width/2-100, game.height/2, 'bird');
    player.anchor.setTo(-0.2, 0.5); 
    player.animations.add('flap',[0,1,2],10,true);


    //Setup player physics
    game.physics.arcade.enable(player);
    player.body.gravity.y = 900;
     
    
    player.animations.play('flap');


    //Game Sounds
    wingSound = game.add.audio('wing');
    swooshSound = game.add.audio('swoosh');
    scoreSound = game.add.audio('point');
    dieSound = game.add.audio('die');


    //Pipe Timer
    //timer = game.time.events.loop(1500, addRowOfPipes, this);
    colTimer = game.time.events.loop(Phaser.Timer.SECOND * SPAWN_RATE, spawnWalls, this );
    //this.colTimer.timer.start();
    
    //Our score at the top of the screen
    labelScore = game.add.text(game.width/2, 15, "0", { font: "30px Arial", fill: "#ffffff" }); 


    //SETUP PAUSE
    pauseLabel = game.add.sprite(game.width - 40, 30, 'pause');
    pauseLabel.anchor.setTo(0.5,0.5);
    pauseLabel.animations.add('clickToPause',[0], 1, false);
    pauseLabel.animations.add('clickToUnPause',[1], 1, true);
    pauseLabel.inputEnabled = true;
    pauseLabel.events.onInputUp.add(pause);

    game.input.onDown.add(unpause, self);// Add a input listener for the pause button


    //Build Menu
    menu = game.add.group();
    var button2 = game.make.button(game.width/2-75, 150, 'restart', restartGame, this, 2, 1, 0, menu);  
    menu.add(button2);
    var button3 = game.make.button(game.width/2-75, 200, 'highScores', goToHighScores, this, 2, 1, 0, menu);
    menu.add(button3);
    var button4 = game.make.button(game.width/2-75, 250, 'exit', exitGame, this, 2, 1, 0, menu);
    menu.add(button4);
    menu.visible = false;


}//END CREATE FUNCTION



function update() {
   
   
   
    //If player is in the world and our game is not over
    if (player.inWorld == false && gameOver == false)
    {    
        gameOver = true;
        hitPipe(); //Hit pipe is like our end of game funciton
        showMenu();
        //background.autoScroll(0,0);
    }else{
        //background.autoScroll(-SPEED *.80,0);
    }
    

    walls.forEachAlive(function(wall){
                if(wall.x + wall.width < game.world.bounds.left){
                    wall.kill();
                }else if(!wall.scored && wall.x <= player.x){
                    addScore(wall);
 
                }
    })


    game.physics.arcade.overlap(player, walls, hitPipe, null, this);

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

    // If the bird has already hit a pipe, we have nothing to do
    if (player.alive == false)
        return;

    // Set the alive property of the bird to false
    player.alive = false;
    dieSound.play();

    // Prevent new pipes from appearing
    game.time.events.remove(colTimer);

    // Go through all the pipes, and stop their movement
    walls.forEachAlive(function(p){
        p.body.velocity.x = 0;
    }, this);

}


function showMenu(){
    
    //Added to prevent game from paused after dieing
    if(game.paused){
        game.paused = false;
    }
    
    menu.visible = true;
}

function pause(){
    if(player.alive){
        pauseLabel.animations.play('clickToUnPause');
        game.paused = true;
    } else {
        return;
    }
}
function unpause(){
    pauseLabel.animations.play('clickToPause');
    game.paused = false;
}


function goToHighScores(){
    console.log('Going to High Scores');
    document.location.href = "#/high-scores?score=" + score;
}


// Restart the game
function restartGame(){
    gameOver = false;
    score = 0;
    labelScore = 0;
    game.state.start('main');
};

function exitGame(){
    console.log('Exit Game');
    document.location.href = "#/home";
};


function spawnWall(y, flipped){
        var wall = walls.create(
            game.width,
            y + (flipped ? -OPENING : OPENING) / 2,
            "column"
        );
 
        game.physics.arcade.enableBody(wall);
        wall.body.allowGravity = false;
        wall.scored = false;
        wall.body.immovable = true;
        wall.body.velocity.x = -SPEED;
        if(flipped){
            wall.scale.y = -1;
            wall.body.offset.y  = -wall.body.height;
        }
 
        return wall;
};
function spawnWalls(){
        var wallY = game.rnd.integerInRange(game.height *.3, game.height *.7);
        var botWall = spawnWall(wallY);
        var topWall = spawnWall(wallY, true);
};
function addScore(wall){
        wall.scored = true;
        score += 0.5;
        labelScore.setText(score);
        scoreSound.play();


};