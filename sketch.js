const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let uvEngine;
let uvWorld;

var ground;
var fruit, rope1, rope2, rope3;
var fruit_connection1;
var fruit_connection2;
var fruit_connection3;

var bg_img;
var cut_button1;
var cut_button2;
var cut_button3;
var mute_button;

var backgroundSound, sadSound, eatingSound, cuttingSound, airSound;

var blinking, eating, crying;
let canH, canW;

function preload() {
  bunny_img = loadImage("Rabbit-01.png");
  ground_img = loadImage("background.png");
  fruit_img = loadImage("melon.png");
  cutbutton_img = loadImage("cut_btn.png");
  bg_img = loadImage("background.png");

  blinking = loadAnimation("blink_1.png", "blink_2.png", "blink_3.png");
  blinking.playing = true;

  eating = loadAnimation(
    "eat_0.png",
    "eat_1.png",
    "eat_2.png",
    "eat_3.png",
    "eat_4.png"
  );
  eating.playing = true;
  eating.looping = false;

  crying = loadAnimation("sad_1.png", "sad_2.png", "sad_3.png");
  crying.playing = true;
  crying.looping = false;

  mute_button = loadImage("mute.png");

  backgroundSound = loadSound("sound1.mp3");
  airSound = loadSound("air.wav");
  cuttingSound = loadSound("Cutting Through Foliage.mp3");
  eatingSound = loadSound("eating_sound.mp3");
  sadSound = loadSound("sad.wav");
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if (isMobile) {
    //if the system is mobile
    canW = displayWidth;
    canH = displayHeight;
    createCanvas(canW + 80, canH);
  } else {
    //if the system is not mobile
    canW = windowWidth;
    canH = windowHeight;
    createCanvas(canW , canH);
  }
  //createCanvas(500, 700);
  frameRate(80);

  backgroundSound.play();
  backgroundSound.setVolume(0.5);

  uvEngine = Engine.create();
  uvWorld = uvEngine.world;

  ground = new Ground(200,canH , 600, 20);

  rope1 = new Rope(7, { x: 245, y: 30 });
  rope2 = new Rope(7, { x: 90, y: 120 });
  rope3 = new Rope(10, { x: 460, y: 120 });

  fruit = Bodies.circle(300, 300, 20);
  fruit.scale = 3;

  Composite.add(rope1.body, fruit);
  //Composite.add(rope2.body, fruit);

  blinking.frameDelay = 20;
  eating.frameDelay = 20;
  crying.frameDelay = 20;
  bunny = createSprite(250,canH-80, 100, 100);
  //bunny.addImage(bunny_img);
  bunny.addAnimation("blinking", blinking);
  bunny.addAnimation("eating", eating);
  bunny.addAnimation("crying", crying);
  bunny.scale = 0.25;

  fruit_connection1 = new Link(rope1, fruit);
  fruit_connection2 = new Link(rope2, fruit);
  fruit_connection3 = new Link(rope3, fruit);

  cut_button1 = createImg("cut_btn.png");
  cut_button1.position(220, 30);
  cut_button1.size(50, 50);
  cut_button1.mouseClicked(drop1);

  cut_button2 = createImg("cut_btn.png");
  cut_button2.position(70, 120);
  cut_button2.size(50, 50);
  cut_button2.mouseClicked(drop2);

  cut_button3 = createImg("cut_btn.png");
  cut_button3.position(430, 120);
  cut_button3.size(50, 50);
  cut_button3.mouseClicked(drop3);

  mute_button = createImg("mute.png");
  mute_button.position(450, 20);
  mute_button.size(50, 50);
  mute_button.mouseClicked(mute);
}

function draw() {
  background(51);
  imageMode(CENTER);
  image(bg_img, width / 2, height / 2, displayWidth+80, displayHeight);
  Engine.update(uvEngine);

  ground.show();
  rope1.show();
  rope2.show();
  rope3.show();

  if (fruit != null) {
    image(fruit_img, fruit.position.x, fruit.position.y, 70, 70);
  }

  if (collide(fruit, bunny) == true) {
    bunny.changeAnimation("eating");
    backgroundSound.stop();
    eatingSound.play();
  }
  if (collide(fruit, ground.body) == true) {
    bunny.changeAnimation("crying");
    backgroundSound.stop();
    sadSound.play();
  }
  drawSprites();
}

function drop1() {
  cuttingSound.play();
  rope1.break();
  fruit_connection1.detach();
  fruit_connection1 = null;
}

function drop2() {
  cuttingSound.play();
  rope2.break();
  fruit_connection2.detach();
  fruit_connection2 = null;
}

function drop3() {
  cuttingSound.play();
  rope3.break();
  fruit_connection3.detach();
  fruit_connection3 = null;
}

function collide(body, sprite) {
  if (body != null) {
    var distBtnBodyandSprite = dist(
      body.position.x,
      body.position.y,
      sprite.position.x,
      sprite.position.y
    );
    if (distBtnBodyandSprite <= 80) {
      World.remove(uvWorld, fruit);
      fruit = null;
      return true;
    } else {
      return false;
    }
  }
}
function mute() {
  if (backgroundSound.isPlaying()) {
    baclgroundSound.stop();
  } else {
    backgroundSound.play();
  }
}
