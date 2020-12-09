//prompt the user to write their name
var user = prompt("Write your username:");

//create the canvas
var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d");
canvas.width = 512;
canvas.height = 460;
document.body.appendChild(canvas);

//Background image
var bgReady = false;
var bgImage = new Image();
bgImage.onload = function () {
    bgReady = true;
};
bgImage.src = "images/background.png";

//Hero image
var heroReady = false;
var heroImage = new Image();
heroImage.onload = function () {
    heroReady = true;
};
heroImage.src = "images/hero_sheet.png";

// Monster image
var monsterReady = false;
var monsterImage = new Image();
monsterImage.onload = function () {
    monsterReady = true;
};
monsterImage.src = "images/monster.png";


// Monster2 image
var monster2Ready = false;
var monster2Image = new Image();
monster2Image.onload = function () {
    monster2Ready = true;
};
monster2Image.src = "images/monster2.png";

// shrek image
var shrekReady = false;
var shrekImage = new Image();
shrekImage.onload = function () {
    shrekReady = true;
};
shrekImage.src = "images/shrek.png";

//Game objects
var hero = {
    x: 0,
    y: 0,
    width: 32,
    height: 32,
    speed: 256,// movement pixels per second 
    direction: {
        x: 0,
        y: 0
    },

    //Animation settings
    animSet: 4,
    animFrame: 0,
    animNumFrames: 2,
    animDelay: 200,
    animTimer: 0,
};

//Base monster speed
var monster = {
    monsterSpeed: 1
};

var shrek = {
    startpos: 0,

    direction: {
        x: 0,
        y: 0
    }
};

var monstersCaught = 0;
var previousCaught = 0;
var levelAt = 1;
let i = 0;

/*Handle Keyboard controls
Checks if key is down*/
var keysDown = {};
addEventListener("keydown", function (e) {
    keysDown[e.code] = true;
}, false);

addEventListener("keyup", function (e) {
    delete keysDown[e.code];
}, false);

//multiple reset functions for each monster, resets their x and y positions
var monsterreset = function () {

    monster.x = 32 + (Math.random() * (canvas.width - 64));
    monster.y = 32;
}

var monster2reset = function () {

    monster2.x = 32;
    monster2.y = 32 + (Math.random() * (canvas.width - 64));
}

var shrekreset = function () {

    shrek.x = 32;
    shrek.y = 32;
}

// Reset the game when a player catches a monster
var reset = function () {
    hero.x = canvas.width / 2;
    hero.y = canvas.height / 2;

    monsterreset();
    monster2reset();
    shrekreset();
    // throw the monster somewhere on the screen randomly
};


var update = function (modifier) {

    /* canvas checks done this high, as 
    the if statement that changes monster 
    speed checks here only for some reason 
    */
    monster.y += monster.monsterSpeed;
    if (monster.y >= canvas.height) {
        monsterreset();
    }
    monster2.x += monster.monsterSpeed;
    if (monster2.x >= canvas.width) {
        monster2reset();
    }
    shrek.y += monster.monsterSpeed;
    shrek.x += monster.monsterSpeed;
    if (shrek.x >= canvas.width || shrek.y >= canvas.height) {
        shrekreset();
    }


    // Update hero animation
    hero.animTimer += modifier;
    if (hero.animTimer >= hero.animDelay) {
        //Enough time has passed to update the animation frame
        hero.animTimer = 0;
        ++hero.animFrame;
        if (hero.animFrame >= hero.animNumFrames) {
            // We've reached the end of the animation frames;
            hero.animFrame = 0;
        }
    }

    //Changes player animations
    var d = hero.direction;
    if (d.x == 0 && d.y == -1) {
        hero.animSet = 0;
    } else if (d.x == 1 && d.y == -1) {
        hero.animset = 1;
    } else if (d.x == 1 && d.y == 0) {
        hero.animSet = 2;
    } else if (d.x == 1 && d.y == 1) {
        hero.animSet = 3;
    } else if (d.x == 0 && d.y == 1) {
        hero.animSet = 4;
    } else if (d.x == -1 && d.y == 1) {
        hero.animSet = 5;
    } else if (d.x == -1 && d.y == 0) {
        hero.animSet = 6;
    } else if (d.x == -1 && d.y == -1) {
        hero.animSet = 7;
    }

    // Calculating the speed
    var move = (hero.speed * (modifier / 1000));
    hero.x += Math.round(move * hero.direction.x);
    hero.y += Math.round(move * hero.direction.y);

    // Are they touching
    if (
        hero.x <= (monster.x + 32)
        && monster.x <= (hero.x + 32)
        && hero.y <= (monster.y + 32)
        && monster.y <= (hero.y + 32)
    ) {
        //Increments the score and calls the monster reset function for monster 1
        ++monstersCaught;
        monsterreset();
    }
    // if (monster.y == canvas.height) {
    //     monsterreset();
    // }

    if (
        hero.x <= (monster2.x + 32)
        && monster2.x <= (hero.x + 32)
        && hero.y <= (monster2.y + 32)
        && monster2.y <= (hero.y + 32)
    ) {
        //Increments the score and calls the monster reset function for monster 2
        ++monstersCaught;
        monster2reset();
    }




    if (
        hero.x <= (shrek.x + 32)
        && shrek.x <= (hero.x + 32)
        && hero.y <= (shrek.y + 32)
        && shrek.y <= (hero.y + 32)
    ) {
        //Increments the score and calls the monster reset function for monster 3
        ++monstersCaught;
        shrekreset();
    }

    if (hero.y == canvas.height || hero.y == 20) {
        return;
    }

    if (hero.x == canvas.width || hero.x == 20) {
        return;
    }


};

var handleInput = function () {

    hero.direction.x = 0;
    hero.direction.y = 0;

    if (38 in keysDown) {// holding up
        hero.direction.y = -1;
    }
    if (40 in keysDown) {// holding down
        hero.direction.y = 1;
    }
    if (37 in keysDown) {// holding left 
        hero.direction.x = -1;
    }
    if (39 in keysDown) {// holding right
        hero.direction.x = 1;
    }

}

var render = function () {

    if (bgReady) {
        ctx.drawImage(bgImage, 0, 0);
    }
    if (heroReady) {
        //Determine which part of the sprite sheet to draw from
        var spriteX = ((hero.animSet * (hero.width * hero.animNumFrames)) + (hero.animFrame * hero.width)
        );

        //Render Image to canvas
        ctx.drawImage(
            heroImage,
            spriteX, 0, hero.width, hero.height,
            hero.x, hero.y, hero.width, hero.height
        );
    }
    if (monsterReady) {
        ctx.drawImage(monsterImage, monster.x, monster.y);
    }
    if (monster2Ready) {
        ctx.drawImage(monster2Image, monster2.x, monster2.y);
    }
    if (shrekReady) {
        ctx.drawImage(shrekImage, shrek.x, shrek.y);

    }

    //Score 
    ctx, fillstyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";

    ctx.textlinebase = "top";
    ctx.fillText("Goblins caught: " + monstersCaught, 32, 48);


    //Username inputted here
    ctx, fillstyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";

    ctx.textlinebase = "top";
    ctx.fillText("username: " + user, 280, 48);

    //Level No. Inputted here
    ctx, fillstyle = "rgb(250, 250, 250)";
    ctx.font = "24px Helvetica";
    ctx.textAlign = "left";

    ctx.textlinebase = "top";
    ctx.fillText("Level: " + levelAt, 280, 69);


    let i = 0;
    if (monstersCaught == (previousCaught + 30)) {
        levelAt++;
        console.log('level up');
        console.log(levelAt);
        previousCaught = monstersCaught;
        monster.monsterSpeed += 0.2;
    }
}

//The main game loop
var main = function () {
    var now = Date.now();
    var delta = now - then;

    //handle user input
    handleInput();

    update(delta);
    render();

    then = now;
};

//Let's play this game 
reset();
var then = Date.now();
setInterval(main, 1);
