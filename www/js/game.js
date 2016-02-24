var game = new Phaser.Game(800, 600, Phaser.AUTO, 'tap-game', 
    { 
        //_phaserIlluminated: null,
        preload: preload, 
        create: create, 
        update: update 
    });



function preload() {

    game.load.image('rock', 'assets/rock.png');
    game.load.image('block', 'assets/block.png');
    //game.load.image('background', 'assets/background.png');
    game.load.spritesheet('z', 'assets/z.png', 96, 96);
    game.load.image("light", "/assets/gfx/light.png");
    

}



var sprite;

var player;
var playerColRadius = 30;
var dia = playerColRadius * 3;

var facing = 'right';
var jumpTimer = 0;
var cursors;
var jumpButton;
var yAxis = p2.vec2.fromValues(0, 1);

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


    this.game.stage.backgroundColor = 0x4488cc;




    //Background Back
    //bg = game.add.tileSprite(0, 0, 800, 600, 'background');

    //  Enable p2 physics
    game.physics.startSystem(Phaser.Physics.P2JS);

    game.physics.p2.gravity.y = 350;
    game.physics.p2.world.defaultContactMaterial.friction = 0.3;
    game.physics.p2.world.setGlobalStiffness(1e5);

    //  Add a sprite
    player = game.add.sprite(200, 400, 'z');
    player.animations.add('left', [0, 1, 2, 3, 4, 5], 7, true);
    player.animations.add('idle', [6, 7, 8, 9, 10, 11], 7, true);
    player.animations.add('right', [12, 13, 14, 15, 16, 17], 7, true);

    //  Enable if for physics. This creates a default rectangular body.
    game.physics.p2.enable(player);

    player.body.setCircle(30);
    player.body.fixedRotation = true;
    player.body.damping = 0.5;
    //player.body.static = true;

    var spriteMaterial = game.physics.p2.createMaterial('spriteMaterial', player.body);
    var worldMaterial = game.physics.p2.createMaterial('worldMaterial');
    var boxMaterial = game.physics.p2.createMaterial('worldMaterial');

    //  4 trues = the 4 faces of the world in left, right, top, bottom order
    game.physics.p2.setWorldMaterial(worldMaterial, true, true, true, true);

    

    //Brick walls
    for(var i=0; i<numColumns; i++){
        console.log("Building Rectangle")

        blockPosY = maxBlockHeight * Math.random() + dia;

        blockHeight = rangeBlockHeight * Math.random() + minBlockHeight;
        
        //Add the sprite
        rect = game.add.sprite(columnStep + columnStep * i, blockHeight, 'block')
        
        //Set random rect height
        // rect.height = ;
        
        


        //Add physics to block
        game.physics.p2.enable(rect);
        rect.body.static = true;
        rect.body.setMaterial(boxMaterial);
        rectangles.push(rect);
    }

    // for(var i=0; i<numRects; i++){
    //     console.log("Building Rectangle")
    //     rectHeight = Math.random() * (height - 2 * minOpening);
    //     rectY = Math.random() * (height - rectHeight - minOpening) + minOpening;
    //     rectangles.push(new Phaser.Rectangle(width + rectStep * i, rectY, circleDia, rectHeight));
    // }


    //  A stack of boxes - you'll stick to these
    // for (var i = 1; i < 4; i++)
    // {
    //     var rock = game.add.sprite(300, 645 - (95 * i), 'rock');
    //     rock.width = 100;
    //     rock.height = 100;

    //     game.physics.p2.enable(rock);
    //     rock.body.mass = 12;
    //     rock.body.setCircle(40);
    //     //rock.body.static = true;
    //     rock.body.setMaterial(boxMaterial);
    // }

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
    
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    player.body.onBeginContact.add(objHit, this);//Check for the block hitting another object    

}

function objHit (body, bodyB, shapeA, shapeB, equation) {

    //  The block hit something.
    //  
    //  This callback is sent 5 arguments:
    //  
    //  The Phaser.Physics.P2.Body it is in contact with. *This might be null* if the Body was created directly in the p2 world.
    //  The p2.Body this Body is in contact with.
    //  The Shape from this body that caused the contact.
    //  The Shape from the contact body.
    //  The Contact Equation data array.
    //  
    //  The first argument may be null or not have a sprite property, such as when you hit the world bounds.
    if (body)
    {
        result = 'You last hit: ' + body.sprite.key;

    }
    else
    {
        result = 'You last hit: The wall :)';
    }

    console.log('result:', result);
}



function update() {

    //

     for(var i=0; i < numColumns; i++){
            //rectangles[i].body.width
            if (rectangles[i].x < -64) {

                blockHeight = rangeBlockHeight * Math.random() + minBlockHeight;
                blockPosY = maxBlockHeight * Math.random() + dia;

                rectangles[i].body.sprite.height = blockHeight;
                rectangles[i].body.x = game.width;
                rectangles[i].body.y = blockHeight;
                //rectangles[i].body.height = rectHeight;
            }
            else {
                //rectangles[i].x -= 1;
                rectangles[i].body.moveLeft(100);
            }
        }



        // myLamp1.refresh();
        // myLamp2.refresh();
        // //myMask.refresh();
        // myLamp1.y -= 0.5;
        // myLamp2.y += 0.5;



    //NORMAL OPERATIONS
    player.animations.play('right');
    // if (cursors.left.isDown)
    // {
    //     player.body.moveLeft(200);

    //     if (facing != 'left')
    //     {
    //         player.animations.play('left');
    //         facing = 'left';
    //     }
    // }
    // else if (cursors.right.isDown)
    // {
    //     player.body.moveRight(200);

    //     if (facing != 'right')
    //     {
    //         player.animations.play('right');
    //         facing = 'right';
    //     }
    // }
    // else
    // {
    //     player.body.velocity.x = 0;

    //     if (facing != 'idle')
    //     {
    //         //player.animations.stop();
    //         player.animations.play('idle');
    //         facing = 'idle';
    //     }
    // }
    
    //&& checkIfCanJump()
    // if (jumpButton.isDown && game.time.now > jumpTimer)
    // {
    //     player.body.moveUp(300);
    //     jumpTimer = game.time.now + 750;
    // }

    game.input.onTap.add(onTap, this);

}

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

    if (doubleTap)
    {
        // // //  They double-tapped, so swap the image
        // // if (pic.key === 'TheEnd')
        // // {
        // //     pic.loadTexture('BountyHunter');
        // // }
        // else
        // {
        //     pic.loadTexture('TheEnd');
        // }
    }
    else
    {
        //  A single tap (tap duration was < game.input.tapRate) so change alpha
        //pic.alpha = (pic.alpha === 0.5) ? 1 : 0.5;
        if (game.time.now > jumpTimer)
        {
            player.body.moveUp(300);
            jumpTimer = game.time.now + 750;
        }
    }
}