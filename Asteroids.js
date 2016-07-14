//Here's the link to the game if you want to play it: file:///Users/Vanshika/Desktop/Asteroids/asteroids.html


var canvas = null;
var context = null;
function Initialize()

{

    console.log("starting");

    canvas = document.getElementById( "gamespace" );
    if ( !canvas.getContext )
    {
        alert( "This browser does not support the canvas element." );        
        return;
    }
    
    context = canvas.getContext( "2d" );



//Detect keypresses for controls
    document.onkeydown = takeControl;
    document.onkeyup = endControl;

//set up Start Screen
    //InitializeGameState("");
}


//////////////////////////////////////////////////////////////
// Define Images for dog, Dropper, Missile, and Explosion

var sploid = [
    "images/sploid1.png",
    "images/sploid2.png",
    "images/sploid3.png",
    "images/sploid4.png",
    "images/sploid5.png",
    "images/sploid6.png",
    "images/sploid7.png",
    "images/sploid8.png",
    "images/sploid9.png",
    "images/sploid10.png"
];

var dogFrames = [

    "images/rocket1.png",
    "images/rocket2.png",
    "images/rocket3.png",
    "images/rocket4.png",
    "images/rocket5.png",
    "images/rocket6.png",
    "images/rocket7.png",
    "images/rocket8.png",
    "images/rocket9.png",
    "images/rocket10.png",
    "images/rocket11.png",
    "images/rocket12.png",
    "images/rocket13.png",
    "images/rocket14.png",
    "images/rocket15.png",
    "images/rocket16.png",
    "images/rocket17.png",
    "images/rocket18.png",
    "images/rocket19.png",
    "images/rocket20.png",
    "images/rocket21.png",
    "images/rocket22.png",
    "images/rocket23.png",
    "images/rocket24.png",
    "images/rocket25.png",

];

var dropArray = [
    ["special", "images/specialstar.png", "specialstar"],// This way, this star will come less often.
    ["yucky", "images/Asteroid.png", "asteroid"], //1
    ["yummy", "images/bluestar.png", "bluestar"],//1
    ["yummy", "images/redstar.png", "redstar"],//1
    ["yucky", "images/rock.png", "rock"],//1
    ["yucky", "images/spacerock.png", "spacerock"],//1
    ["yucky", "images/Asteroid copy.png", "asteroid"],//2
    ["yummy", "images/bluestar copy.png", "bluestar"],//2
    ["yummy", "images/redstar copy.png", "redstar"],//2
    ["yucky", "images/rock copy.png", "rock"],//2
    ["yucky", "images/spacerock copy.png", "spacerock"]//2
];

var missileImg = new Image();
missileImg.src = "images/missile.png";

//preload explosion images
var splosion = [];
for(var i = 1; i <= 10; i++){
    splosion[i] = new Image();
    splosion[i].src = sploid[i-1];
    }

//preload dog images
var dogs = [];
for(var i = 0; i < dogFrames.length; i++){
    dogs[i] = new Image();
    dogs[i].src = dogFrames[i];
    }
    dogs[dogFrames.length - 1].addEventListener("load", function(){
        InitializeGameState("");
    });    

// reload dropper images
var dropperImages = [];
for(var p = 0; p < dropArray.length; p++){
    dropperImages[p] = new Image();
    dropperImages[p].src = dropArray[p][1];
}


//////////////////////////////////////////////////////////////
// Define Objects for dog, Dropper, Missile, and Explosion

var missile = function(){
    this.me = "missile";
    this.img = missileImg;
    this.x = 0;
    this.y = 0;
}

var Dog = function(){
    this.me = "dog";
    this.img = dogs[0];
    this.x = 0;    this.y =0;
    this.curframe = 1;
}


var explosion = function(x,y){
    this.frames = splosion;
    this.me = "explosion";
    this.x = x;
    this.y = y;
    this.img = {
        width: 0,
        height: 0
        }
    this.curframe = 1;
} 

var Dropper = function(type, img, name){
    this.me = type; //"yummy" or "yucky"
    this.img = img; 
    this.name = name;
    this.x = 0;
    this.y = 0;
    this.side = 0;
}  


////////////////////////////////////////
// Define controls

var dirs = {
    l: false, // left arrow down?
    r: false, // right arrow down?
    f: false, // fire key down?
}


function takeControl(e){ // our key down function 
    if (e.keyCode == 37) dirs.l = true;
    if (e.keyCode == 39) dirs.r = true;
    if (e.keyCode == 32) dirs.f = true;
    if (e.keyCode == 38) fire = true;
}

function endControl(e){ // our key up function
    if (e.keyCode == 37) dirs.l = false;
    if (e.keyCode == 39) dirs.r = false;
    if (e.keyCode == 32) dirs.f = false;
}


/////////////////////////////////////////////////////////////////////////////////
// Define global game variables

var dog, missiles, maxMissiles, missileDelay, dropperDelay, missileSpeed, lastMissile, lastDropper, dogspeed, dropperMaxSpeed, dropperMinDelay, killCount, dodgeCount, dogFrame;

var score = 0;
var gameover = true;

/////////////////////////////////////////////////////////////////////////////////
// Set up the start screen

function InitializeGameState(replay)
{
    console.log("running gs");
    if(replay !=="again") replay = "";
    
    //Set startup values for replays...
    dog = new Dog(); // replace the explosion with a new dog
    droppers = [] ; // array to hold droppers
    missiles = []; // array to hold missiles
    maxMissiles = 100; // the max missiles that can be on the screen at a time
    missileDelay = 0.5; // minimum frame delay between firing missiles
    dropperDelay = 90; // frame delay between dropper spawns, goes down as you play
    missileSpeed = 55; // pixels a missile travels upward in one frame
    lastMissile = 0; // counter to enforce missile delay
    lastDropper = 0; //counter to enforce dropper delay
    dogspeed = 8; // number of pixels dog can go horizontally in a frame
    dropperMaxSpeed = 50; // maximum dropper speed;
    dropperMinDelay = 7; // minimum number of frames between dropper spawn
    killCount = 0;
    dodgeCount = 0; 

    // set dog in bottom middle
    dog.x = (canvas.width - dog.img.width) / 2;
    dog.y = (canvas.height - dog.img.height);
    context.fillStyle = "#000000";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.font = "20pt 'Arial Black'";
    txt = "Click to play" + replay;
    var txtX = context.measureText(txt).width;
    context.fillStyle = "#FFFF00";
    context.fillText(txt, (canvas.width - txtX)/2, 80); 
    context.fillText(score.toString(), 5, 35);
    context.drawImage(dog.img, dog.x, dog.y);
    canvas.addEventListener('click',StartGame)
}

/////////////////////////////////////////////////////////////////////////////////
// First frame of game, call Game Loop

function StartGame(){
    canvas.removeEventListener('click',StartGame)
    score = 0;
    context.fillStyle = "#000";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.drawImage(dog.img, dog.x, dog.y);
    gameover = false;
    Tick();
}

/////////////////////////////////////////////////////////////////////////////////
// Game Loop

function Tick()
{

    //set the background fill and print the score 
    context.fillStyle = "#000000";
    context.fillRect(0,0,canvas.width,canvas.height);
    context.fillStyle = "#FFFF00";
    context.fillText(score.toString(), 5, 35);

    //update the positions of the different sprites and check for collisions
    updateMissiles();
    updatedog();
    updateDroppers();
    checkCollisions();

    //go back for another round
    if(!gameover) window.requestAnimFrame(Tick);
}


/////////////////////////////////////////////////////////////////////////////////
// Sprite Updaters

function updateMissiles(){
    lastMissile++;
    if(dirs.f == true){ // spacebar has been pressed
        if((lastMissile > missileDelay) && (missiles.length < maxMissiles)){ 
            missiles.push(initMissile());
            lastMissile = 0;
            dirs.f = false;
        }
    }
    missiles.forEach(function(shot, index, group){
            if(shot.me === "explosion"){
             shot = updateExplosion(shot);
             if(shot.curframe == 10) {
                missiles.remove(index);
             }
            } else {
            shot.y = shot.y - missileSpeed;
            if (shot.y < (0 - shot.img.height)) group.remove(index);
            context.drawImage(shot.img, shot.x, shot.y);
            }
    });
}


function initMissile(){ // initializes a new missile object based on dog position
    var thismissile = new missile();
    thismissile.x = ((dog.x + (dog.img.width/2)) - (thismissile.img.width / 2));
    thismissile.y = (canvas.height - thismissile.img.height) - 40;
    return thismissile; 
}

function updatedog(){
    if (dog.me === "explosion") {
        updateExplosion(dog);
        if(dog.curframe > 10) endGame();
        return;
    }

    if((dirs.l)||(dirs.r)){
        dog.curframe++;
        if (dog.curframe == dogs.length){
            dog.curframe = 0;
        }
        dog.img = dogs[dog.curframe];
        //alert(dog.curframe)
    }
    if(dirs.l) dog.x -= dogspeed; 
    if(dirs.r) dog.x += dogspeed; 
    //make sure we're not going offscreen
    if(dog.x < 0) dog.x = 0;
    if(dog.x > (canvas.width - dog.img.width)) dog.x = canvas.width - dog.img.width;  
    // draw the dog      
   // alert(dog.x, dog.y)
    context.drawImage(dog.img, dog.x, dog.y);
}


function updateDroppers(){
    // For every 5 droppers killed or dodged, frames between spawn decreases by 1
    // Speed of droppers in vertical pixels is (1 / frames between spawn) * 120;
    calcdelay = Math.ceil(dropperDelay - ((killCount + dodgeCount)/5));
    if(calcdelay < dropperMinDelay) calcdelay = dropperMinDelay;
    // increment number of ticks since last spawn. If it's more than the delay, spawn
    lastDropper += 1;
    if(lastDropper > calcdelay){
        // spawn a dropper
        lastDropper = 0;
        var myrand = Math.floor(Math.random() * (dropArray.length + 1));
            if (myrand >= dropArray.length) myrand = myrand - (Math.floor(Math.random() * (dropArray.length - 2)) +1);
        var temp = new Dropper(dropArray[myrand][0],dropperImages[myrand],dropArray[myrand][2]);
        // set entry point & horizontal speed
        temp.y = -15;
        temp.x = Math.random() * (canvas.width - (temp.img.width + 15) + 12)
        var coinflip = Math.random();
        if(coinflip > .5){
            temp.side = 0 - (((Math.random() * 15) + 1)/3);
        } else {
            temp.side = 0 + (((Math.random() * 15) + 1)/3);
        }
        droppers.push(temp);
     }


     //move all the droppers in the droppers array this round
     var enspeed = (1/calcdelay) * 120;
        droppers.forEach(function(dropper, index, dropperList){
        if(dropper.me === "explosion"){ // if an dropper has been converted to an explosion, animate it
             dropper = updateExplosion(dropper);
             if(dropper.curframe == 10) { // if the explosion animation is over, remove the dropper from droppers
                dropperList.remove(index);
            }
        } else {
            //update position
            dropper.y += enspeed;
            dropper.x += dropper.side;
            if(dropper.x  < 0){
               dropper.x = 0;
               dropper.side = 0 - dropper.side;
               }
            if((dropper.x + dropper.img.width) > canvas.width){
               dropper.x = canvas.width - dropper.img.width;
               dropper.side = 0 - dropper.side;
               } 
            context.drawImage(dropper.img, dropper.x, dropper.y);
            //check for falling off screen
            if(dropper.y > (canvas.height + 20)) {
                if(dropper.me == "yucky"){
                    score = score - 3;
                }
                if(dropper.me == "special"){
                    score = score - 5;
                }
                 else {
                    score = score - 1;
                }
                dropperList.remove(index);
                dodgeCount++;
            }
        }
    });
}


function updateExplosion(item){
    item.curframe = item.curframe + .5;
    context.drawImage(item.frames[Math.floor(parseInt(item.curframe))], item.x, item.y);
    return item;
}


function checkCollisions(){
    droppers.forEach(function(dropper, enindex, dropperList){
        if(intersects(dropper.x, dropper.y, dropper.img.width, dropper.img.height, dog.x, dog.y, dog.img.width, dog.img.height)){

            killCount++;
            if(dropper.me == "yucky"){
                droppers[enindex] = new explosion(dropper.x,dropper.y);
                dog = new explosion(dog.x+10, dog.y+20)
            } 
            if(dropper.me == "special"){
            	score +=10
            	dropperList.remove(enindex);
            } 
            else {
                score +=5;
                dropperList.remove(enindex);
            }
        }
        missiles.forEach(function(shot, index, group){
            if((intersects(dropper.x, dropper.y, dropper.img.width, dropper.img.height, shot.x, shot.y, shot.img.width, shot.img.height)) && (dropper.me != "explosion")){
                killCount++;
                droppers[enindex] = new explosion(dropper.x,dropper.y);
                missiles[index] = new explosion(dropper.x + 15,dropper.y + 10);
                if(dropper.me == "yucky"){
                   score += 5;
                } 
                if(dropper.me == "special"){
                	score = score - 7
                }
                else {
                    score = score - 3;
                }
               }
        });
    });

}





function endGame(){
    gameover = true;
    InitializeGameState(" again");

}

/////////////////////////////////////////////////////////////////////////////////
// Helper Functions

/* Request Animation Frame fallback (thanks Paul Irish) */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
          window.webkitRequestAnimationFrame ||
          window.mozRequestAnimationFrame    ||
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();


/*
function NegativeScore(){
    if score < 0{
        endGame
   }
}
*/


// Array Remove - By John Resig (MIT Licensed)
// used to remove dead/offscreen droppers and missiles from their arrays
Array.prototype.remove = function(from, to) {
  var rest = this.slice((to || from) + 1 || this.length);
  this.length = from < 0 ? this.length + from : from;
  return this.push.apply(this, rest);
};

// detect if two rectangles intersect (borrowed from stack overflow)
function intersects(x1, y1, w1, h1, x2, y2, w2, h2) {
    w2 += x2;
    w1 += x1;
    if (x2 > w1 || x1 > w2) return false;
    h2 += y2;
    h1 += y1;
    if (y2 > h1 || y1 > h2) return false;
  return true;
}

Initialize();







