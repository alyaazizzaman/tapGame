//var game = new Phaser.Game(window.innerWidth * window.devicePixelRatio, window.innerHeight * window.devicePixelRatio, Phaser.AUTO, 'tap-game', 
//var game = new Phaser.Game(1024, 672, Phaser.AUTO, 'tap-game', 
var game = new Phaser.Game(960, 640, Phaser.AUTO, 'tap-game', 
    { 
        //_phaserIlluminated: null,
        preload: preload, 
        create: create, 
        update: update,
        render: render
    });



function preload() {
    //SETUP STAGE
    scaleStage();

    game.load.image('rock', 'assets/rock.png');
    game.load.image('block', 'assets/block.png');
    //game.load.image('background', 'assets/background.png');
    game.load.spritesheet('z', 'assets/z.png', 96, 96);
    game.load.image("light", "/assets/gfx/light.png");

}



/*
WINDOW SCALING - you can set this for high DPR devices
For instance the iPhone 6 has almost double the pixels smashed together
for a high resolution, use this scale ratio on assets.
If needed: Uncomment below, then assign each needed asset with this:
        asset.scale.setTo(scaleRatio, scaleRatio);
*/
var scaleRatio = window.devicePixelRatio/2;

/*
scaleStage function
This is for screen resizing and correction for different devices
First tries to force screen scale to match device
Next it does the same thing for the element representing the "canvas".
So beyond html meta or css, this forces phaser and then the containing element
to match the devices size.
*/
function scaleStage(){
    if (game.device.desktop)        
    {            
        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;            
        game.scale.minWidth = game.width/2;            
        game.scale.minHeight = game.height/2;            
        game.scale.maxWidth = window.innerWidth * window.devicePixelRatio; //game.width;            
        game.scale.maxHeight = window.innerHeight * window.devicePixelRatio;//game.height;            
        game.scale.pageAlignHorizontally = true;            
        game.scale.pageAlignVertically = true;         
        //game.scale.setScreenSize(true);       
    } else {

        game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        game.scale.minWidth = 480;
        game.scale.minHeight = 260;
        game.scale.maxWidth = 1334;
        game.scale.maxHeight = 750;
        game.scale.forceLandscape = true;
        game.scale.pageAlignHorizontally = true;
    }


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

    //The css for body includes 1px top margin, I believe this is the cause for this -1
    document.getElementById("tap-game").style.overflow = "hidden";
}




//PLAYER VARIABLES
var player;
var playerColRadius = 30;
var dia = playerColRadius * 3;
var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var yAxis = p2.vec2.fromValues(0, 1);

//MOBILE CONTROLS
var swipeCoordX,        
swipeCoordY,        
swipeCoordX2,        
swipeCoordY2,        
swipeMinDistance = 100;

//DEATH COLLISION
var deathSpr;

//ILLUMINATION
// var myLamp1;
// var myLamp2;
var myObj;
var myObjs;

var rectangles = [];
var numColumns = 2;
var rect;
var maxBlockHeight = game.height - dia;
var minBlockHeight = 96;
var rangeBlockHeight = maxBlockHeight - minBlockHeight;
var columnStep = (game.width + dia ) / numColumns; //distance between columns
var blockPosY;


function create() {

        //game.world.setBounds(0, 0, 2000, 2000);

        //initialize the phaser-illuminated object and functions
       //  game.plugins.add(Phaser.Plugin.PhaserIlluminated);

       //  myBackgroundBmd = game.add.bitmapData(game.width, game.height);
       //  myBackgroundBmd.ctx.fillStyle = "#333333";
       //  myBackgroundBmd.ctx.fillRect(0, 0, game.width, game.height);
       //  game.cache.addBitmapData('background', myBackgroundBmd);
       //  myBackgroundSprite = game.add.sprite(0, 0, myBackgroundBmd);

       //  //add a lamp to the game
       //  myLamp1 = game.add.illuminated.lamp(0, 0);
       //  //myMask = game.add.illuminated.darkMask();
       //  console.log("LAMP: ", myLamp1);

       //  myLamp2 = game.add.illuminated.lamp(0, 0);
       //  //myMask.bringToTop();
       //  //myMask.addLampSprite(myLamp2);

       //  myObj = game.add.illuminated.polygonObject([{x: 10, y: 200}, {x: 300, y: 200}, {x: 150, y: 300}]);
       // // myObj2 = game.add.illuminated.rectangleObject(250, 160, 40, 40);
       //  //myObj3 = game.add.illuminated.rectangleObject (80, 180, 40, 40);
       //  myObjs = [myObj];
       //  myLamp2.createLighting(myObjs);
       //  myLamp1.createLighting(myObjs);

    //Setup our game world
    game.world.setBounds(0, 0, 3000, 640);
    //Background Back
    game.stage.backgroundColor = 0x4488cc;
    //bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.gravity.y = 350;
    game.physics.p2.world.defaultContactMaterial.friction = 0.3;
    game.physics.p2.world.setGlobalStiffness(1e5);

    //  Add a sprite
    player = game.add.sprite(200, 400, 'z');
    player.scale.setTo(scaleRatio, scaleRatio);
    player.animations.add('left', [0, 1, 2, 3, 4, 5], 7, true);
    player.animations.add('idle', [6, 7, 8, 9, 10, 11], 7, true);
    player.animations.add('right', [12, 13, 14, 15, 16, 17], 7, true);

    //  Enable if for physics. This creates a default rectangular body.
    game.physics.p2.enable(player);
    player.body.setCircle(30);
    player.body.fixedRotation = true;
    player.body.damping = 0.1;
    //player.body.static = true;

    //Death Sprite for getting pinched between left wall and object
    deathSpr = game.add.sprite(0,0,'block');
    deathSpr.height = game.height;


    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    var boxMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);



    //Brick walls
    // for(var i=0; i<numColumns; i++){
    //     blockPosY = maxBlockHeight * Math.random() + dia;
    //     blockHeight = rangeBlockHeight * Math.random() + minBlockHeight;

    //     //Add the sprite
    //     rect = game.add.sprite(columnStep + columnStep * i, blockHeight, 'block')
    //     //rect.scale.setTo(scaleRatio, scaleRatio)
    //     //Set random rect height
    //     // rect.height = ;
        
    //     //Add physics to block
    //     game.physics.p2.enable(rect);
    //     rect.body.static = true;
    //     //rect.body.scale.setTo(scaleRatio, scaleRatio);
    //     rect.body.setMaterial(boxMaterial);
    //     rectangles.push(rect);
    // }




    //PHYSICS ROCKS
    var rockGroup = game.add.physicsGroup(Phaser.Physics.P2JS);
    for (var i = 1; i < 4; i++)
    {
        //var rock = game.add.sprite(300, 645 - (95 * i), 'rock');
        var rock = rockGroup.create(game.world.randomX, game.rnd.between(0, 100), 'rock');
        rock.body.setCircle(40);
        //rock.body.fixedRotation = true;
        rock.body.mass = 12;
        rock.width = 100;
        rock.height = 100;

        //game.physics.p2.enable(rock);
        //rock.body.static = true;
        rock.body.setMaterial(boxMaterial);
    }

    //  Here is the contact material. It's a combination of 2 materials, so whenever shapes with
    //  those 2 materials collide it uses the following settings.
    var groundPlayerCM = game.physics.p2.createContactMaterial(spriteMaterial, worldMaterial, { friction: 0.0 });
    var groundBoxesCM = game.physics.p2.createContactMaterial(worldMaterial, boxMaterial, { friction: 0.6 });

    //  Here are some more options you can set:
    // contactMaterial.friction = 0.0;     // Friction to use in the contact of these two materials.
    // contactMaterial.restitution = 0.0;  // Restitution (i.e. how bouncy it is!) to use in the contact of these two materials.
    // contactMaterial.stiffness = 1e3;    // Stiffness of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.relaxation = 0;     // Relaxation of the resulting ContactEquation that this ContactMaterial generate.
    // contactMaterial.frictionStiffness = 1e7;    // Stiffness of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.frictionRelaxation = 3;     // Relaxation of the resulting FrictionEquation that this ContactMaterial generate.
    // contactMaterial.surfaceVelocity = 0.0;        // Will add surface velocity to this material. If bodyA rests on top if bodyB, and the surface velocity is positive, bodyA will slide to the right.
    
    // cursors = game.input.keyboard.createCursorKeys();
    // jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    
    //THIS DETECTS COLLION VIA P2 - calls objHit and sends you the name of the result
        //player.body.onBeginContact.add(objHit, this);//Check for the block hitting another object    
    //below is a non-physics way to detect intersection called sprite.overlay

}

// function objHit (body, bodyB, shapeA, shapeB, equation) {

//     if (body)
//     {
//         result = 'You last hit: ' + body.sprite.key;

//     }
//     else
//     {
//         result = 'You last hit: The wall :)';
//     }

//     console.log('result:', result);
// }
// function checkOverlap(spriteA, spriteB) {

//     var boundsA = spriteA.getBounds();
//     var boundsB = spriteB.getBounds();

//     return Phaser.Rectangle.intersects(boundsA, boundsB);

// }


function update() {

        // myLamp1.refresh();
        // myLamp2.refresh();
        // //myMask.refresh();
        // myLamp1.y -= 0.5;
        // myLamp2.y += 0.5;

     // for(var i=0; i < numColumns; i++){
            
     //        if (rectangles[i].x < -64) {
     //            //Use the blockHeight to randomly set the heigh to the object
     //            blockHeight = rangeBlockHeight * Math.random() + minBlockHeight;
     //            blockPosY = maxBlockHeight * Math.random() + dia;
     //            var width = rangeBlockHeight * Math.random() + minBlockHeight;
     //            rectangles[i].body.setRectangle(width, blockHeight);

     //            //Reset Position
     //            rectangles[i].body.x = game.width;
     //            rectangles[i].body.y = blockHeight;
     //        }
     //        else {
     //            //rectangles[i].x -= 1;
     //            rectangles[i].body.moveLeft(100);
     //        }
     //    }





   

    var camera = game.camera.x += 1;
    //deathSpr.x += 1;


    if(player.x < camera.x + player.width){
        //player.x = camera.x + player.width;
        //pCol = 1;
        console.log("Player is behind camera")
    }

    //Mobile Swipe Functionality
    //player.body.setZeroVelocity();

    game.input.onDown.add(function(pointer) {        
        swipeCoordX = pointer.clientX;        
        swipeCoordY = pointer.clientY;        
    }, this);    

    game.input.onUp.add(function(pointer) {        
        swipeCoordX2 = pointer.clientX;       
        swipeCoordY2 = pointer.clientY;        
        if(swipeCoordX2 < swipeCoordX - swipeMinDistance){            
            player.body.moveLeft(300);

            if (facing != 'left')
            {
                player.animations.play('left');
                facing = 'left';
            }

        }else if(swipeCoordX2 > swipeCoordX + swipeMinDistance){                  
            player.body.moveRight(300);
            if (facing != 'right')
            {
                player.animations.play('right');
                facing = 'right';
            }     
        }    
    }, this);   

    //Jump Function
    game.input.onTap.add(onTap, this);



    // //Death Sprite
    //  if (checkOverlap(player, deathSpr))
    // {
        
    //     console.log('OverLapping: TRUE');
    // } else {
        
    //     console.log('OverLapping: FALSE');
    // }




}

//FOR JUMP FUNCTIONALITY
function checkIfCanJump() {
    var result = false;
    for (var i=0; i < game.physics.p2.world.narrowphase.contactEquations.length; i++)
    {
        var c = game.physics.p2.world.narrowphase.contactEquations[i];
        if (c.bodyA === player.body.data || c.bodyB === player.body.data)
        {
            var d = p2.vec2.dot(c.normalA, yAxis);
            if (c.bodyA === player.body.data)
            {
                d *= -1;
            }

            if (d > 0.5)
            {
                result = true;
            }
        }
    }
    return result;
}

function onTap(pointer, doubleTap) {
    if(doubleTap){
        player.body.setZeroVelocity();
    }else{
        player.body.moveUp(300);
    }
}




function render() {

    game.debug.cameraInfo(game.camera, 32, 32);
    game.debug.spriteCoords(player, 32, 500);

}