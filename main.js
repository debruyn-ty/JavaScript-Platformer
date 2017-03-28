 //create canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//define constants
const width = 500;
const height = 350;

//define varibles
var counter = 0;
var platformList = [];
var lavaList = [];
var goalPoints = [];
var level = 0;

var player = {
  x: 20,
  y: 20,
  dx: 4,
  dy: 0,
  width: 20,
  height: 20,
  falling: true,
};

var keyPressed = {
  w: false,
  s: false,
  a: false,
  d: false,
  space: false,
};

changeLevel();

/* MAIN LOOP */
setInterval(function(){
  counter++;
  ctx.fillStyle = "#2a2b2d";
  ctx.fillRect(0,0,width,height);

  updateplayer();
  updateObjects();
},1000/60);

document.onkeydown = function(event){
  player.hasMoved = true;
  if(event.keyCode === 68){ //d
          keyPressed.d = true;
  }
  else if(event.keyCode === 83){ //s
          keyPressed.s = true;
  }
  else if(event.keyCode === 65){ //a
          keyPressed.a = true;
  }
  else if(event.keyCode === 87){ //w
          keyPressed.w = true;
  }

  else if(event.keyCode === 39){
          keyPressed.d = true;
  }
  else if(event.keyCode === 40){
          keyPressed.s = true;
  }
  else if(event.keyCode === 37){
          keyPressed.a = true;
  }
  else if(event.keyCode === 38){
          keyPressed.w = true;
  }

  if(event.keyCode === 32){
        keyPressed.space = true;
  }
}

document.onkeyup = function(event){
  if(event.keyCode === 68) //d
          keyPressed.d = false;
  else if(event.keyCode === 83) //s
          keyPressed.s = false;
  else if(event.keyCode === 65) //a
          keyPressed.a = false;
  else if(event.keyCode === 87) //w
          keyPressed.w = false;

  else if(event.keyCode === 39){
          keyPressed.d = false;
  }
  else if(event.keyCode === 40){
          keyPressed.s = false;
  }
  else if(event.keyCode === 37){
          keyPressed.a = false;
  }
  else if(event.keyCode === 38){
          keyPressed.w = false;
  }

  if(event.keyCode === 32){
          keyPressed.space = false;
  }
}

function updateplayer(){
  ctx.fillStyle="#ccdfff";

  if(keyPressed.a == true)
    player.x -= player.dx;
  if(keyPressed.d == true)
      player.x += player.dx;
  if(keyPressed.space == true && player.falling == false){
    player.falling = true;
    player.dy = -10;
  }

  if(player.falling == true){
    player.dy += 0.5;
  }

  player.y += player.dy;
  if(player.y > height)
    reset();
  if(player.x > width - player.width)
    player.x = width -  player.width;
  if(player.x < 0)
      player.x = 0;

  ctx.fillRect(player.x,player.y,player.width,player.height);
}

function platform(x,y,w,h,t=1,dx=0,dy=0){
  this.x = x;
  this.y = y;

  this.dx = dx;
  this.dy = dy;

  this.w = w;
  this.h = h;
  this.t = t;

  this.update = function(){
    if(this.t == 2){
      this.x += this.dx;
      this.y += this.dy;
      if(this.x + this.w > width || this.x < 0)
        this.dx = -this.dx;
      if(this.y + this.h > height || this.y < 0)
          this.dy = -this.dy;
    }

    if(this.t == 3){
        ctx.fillStyle="#d2d2d2";
    } else if(this.t == 4){
        ctx.fillStyle="#dfdfdf";
    } else {
      ctx.fillStyle="#FFFFFF";
    }
    ctx.fillRect(this.x,this.y,this.w,this.h);

  }
}

function goal(x,y,w,h){
  this.x = x;
  this.y = y;

  this.w = w;
  this.h = h;

  this.update = function(){
    ctx.fillStyle="#deffbf";
    ctx.fillRect(this.x,this.y,this.w,this.h);
  }
}

function lava(x,y,w,h){
  this.x = x;
  this.y = y;

  this.w = w;
  this.h = h;

  this.update = function(){
    ctx.fillStyle="#ffbfbf";
    ctx.fillRect(this.x,this.y,this.w,this.h);
  }
}

function updateObjects(){
    var counter2 = 0;
    for(i in platformList){
      platformList[i].update();

      if (player.x < platformList[i].x + platformList[i].w &&
     player.x + player.width > platformList[i].x &&
     player.y < platformList[i].y + platformList[i].h&&
     player.height + player.y > platformList[i].y){
        counter2++;

        if(player.dy >= 0){
          player.y = platformList[i].y - player.height;
        }  else {
          player.y = platformList[i].y + player.height;
          keyPressed.space = false;
        }

        if(platformList[i].t == 2)
          player.x += platformList[i].dx*2;
        if(platformList[i].t == 3)
          player.x += platformList[i].dx;
     }
    }

    for(i in goalPoints){
      goalPoints[i].update();

      if (player.x < goalPoints[i].x + goalPoints[i].w &&
     player.x + player.width > goalPoints[i].x &&
     player.y < goalPoints[i].y + goalPoints[i].h &&
     player.height + player.y > goalPoints[i].y){
       changeLevel();
     }
    }

    for(i in lavaList){
      lavaList[i].update();

      if (player.x < lavaList[i].x + lavaList[i].w &&
     player.x + player.width > lavaList[i].x &&
     player.y < lavaList[i].y + lavaList[i].h &&
     player.height + player.y > lavaList[i].y){
       reset();
     }
    }

    if(counter2 >= 1){
      player.falling = false;
      player.dy = 0;
    } else {
      player.falling = true;
    }
}
function reset(){
  player.x = 20;
  player.y = 20;
  player.dy = 0;
  player.width = 20;
}

function changeLevel(){
  reset();
  ctx.fillStyle = "58396b";
  for(var i = 0; i > height; i += 0.2){
    ctx.fillRect(width,0,20,i);
  }
  level++;
  platformList = [];
  lavaList = [];
  goalPoints = [];

  switch(level){
    case 1:
      platformList[1] = new platform(20,150,20,20);
      platformList[2] = new platform(300,250,200,20);
      platformList[3] = new platform(150,100,200,20);
      lavaList[1] = new lava(170,80,20,20);
      goalPoints[1] = new goal(300,225,20,20);
      break;
    case 2:
      platformList[1] = new platform(20,250,20,20);
      platformList[2] = new platform(150,250,200,20);
      lavaList[1] = new lava(200,230,20,20);
      lavaList[2] = new lava(270,200,20,50);
      platformList[3] = new platform(375,200,20,20);
      platformList[4] = new platform(395,150,20,20);
      platformList[5] = new platform(150,100,200,20);
      goalPoints[1] = new goal(150,60,20,20);
      break;
    case 3:
      platformList[1] = new platform(20,230,20,20);
      platformList[2] = new platform(150,250,75,20,2,1.5,0);
      platformList[3] = new platform(375,200,20,20);
      platformList[4] = new platform(395,150,20,20);
      platformList[7] = new platform(150,100,75,20);
      platformList[5] = new platform(250,100,109,20);
      platformList[6] = new platform(150,100,200,20);
      goalPoints[1] = new goal(150,60,20,20);
      break;
    case 4:
      platformList[1] = new platform(0,70,400,20);
      platformList[2] = new platform(150,150,75,20,2,2,0);
      platformList[3] = new platform(0,270,100,20);
      platformList[4] = new platform(0,290,75,20,2,3,0);
      lavaList[1] = new lava(100,200,400,20);
      goalPoints[1] = new goal(width-20,240,20,20);
      break;
    case 5:
        platformList[1] = new platform(0,100,200,20,3,1,0);
        platformList[2] = new platform(100,200,350,20,3,-5,0);
        lavaList[1] = new lava(430,100,20,100);
        platformList[3] = new platform(0,290,100,20,2,3,0);
        lavaList[2] = new lava(200,100,100,20);
        goalPoints[1] = new goal(width-20,270,20,20);
        lavaList[2] = new lava(120,270,20,20);
        break;
    default:
      platformList[1] = new platform(0,height-20,width,20,2,0,2);
  }
}
