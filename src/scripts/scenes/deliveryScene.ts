
import food from '../objects/food';
import bag from '../objects/bag';
import player from '../objects/player';
import { GameObjects } from 'phaser';
import {Entry} from '../objects/entry';
import {Dictionary} from '../objects/dictionary';


export default class DeliveryScene extends Phaser.Scene {
  private deliveryscene;
  private orderscene;

  private tomato: any;
  //real DScene linesn28-36
  private chicken: any;
  private chickenText;
  private bacon: any;
  private baconText;
  private ham: any;
  private hamText;
  //real DScene lines 43-47
  private bag: bag;
  private player;
  private paper: any;
  private orderDone: any;
  private food: any;
  private foods: Array<any>;
  private foodList: any;
  private foodDragged: any;
  private order: any;
  private table: any;
  private checkmark: any;
  private xmark: any;
  orderFoodText;
  cursorKeys;
  score: number;
  scoreLabel;
  conveyor;
  orderFood: string[];
  

  constructor() {
    super({ key: 'DeliveryScene' });
    
  }

  create() {

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(500, 500, "pixelFont", "SCORE", 200);
  


    this.orderscene = this.add.image(0,0, "orderscene");
    this.orderscene.setOrigin(0,0);
    this.conveyor = this.add.tileSprite(0, 750, 2600, 200, "conveyor");
    this.conveyor.setOrigin(0,0);
    this.table = this.add.image(this.scale.width / 2 - 900, this.scale.height / 2 + 630, "table");
    //Non-Food Related Items
    this.bag = this.physics.add.image(this.scale.width / 2 - 900, this.scale.height / 2 + 400, "bag");
    this.paper = this.add.image(285, 300, "paper");
    this.paper.setScale(1.5);
    this.add.text(50,50, "Order:",{fill:"#000000", fontSize:"40px"});
    this.add.text(60, 400, "drag the food into\n the bag to\n fulfill the order", {fill:"#000000", fontSize:"40px"});

    this.score = 0;
    this.scoreLabel = this.add.bitmapText(2000, 1500, "pixelFont", "SCORE", 100);

    this.foods = ["chicken", "ham", "bacon"];
    this.foodList = [];

    //Vegetables
    this.tomato = this.physics.add.image(this.scale.width / 4 - 50, this.scale.height / 2, "tomato").setInteractive();
    this.input.setDraggable(this.tomato);
    let dictionary = new Dictionary();
    //this is broken
    dictionary.addEntry("tomato", "tomate", "tomate", "tomato");

    this.input.dragDistanceThreshold = 16;
    
    this.input.on('dragstart', function (pointer, gameObject) {
      //change this color later
      gameObject.setTint(0xff0000);
  });
  
  this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
  });

  this.input.on('dragend', function (pointer, gameObject) {
    gameObject.clearTint();
  });



    //Meats
    this.chicken = this.physics.add.image(this.scale.width / 50, this.scale.height / 2, "chicken").setInteractive();
    this.input.setDraggable(this.chicken);
    this.chicken.setScale(0.5);
    dictionary.addEntry("chicken", "pollo", "poulette", "chicken");
    this.chickenText = this.add.text(0, 0, "chicken", {fill:"#000000", fontSize:"35px"});
    this.bacon = this.physics.add.image(this.scale.width / 3 - 300, this.scale.height / 2, "bacon").setInteractive();
    this.input.setDraggable(this.bacon);
    this.baconText = this.add.text(0, 0, "bacon", {fill:"#000000", fontSize:"35px"});
    dictionary.addEntry("bacon", "tocino", "bacon", "bacon");
    this.ham = this.physics.add.image(this.scale.width / 2 - 50, this.scale.height / 2, "ham").setInteractive();
    this.input.setDraggable(this.ham);
    this.ham.setScale(0.5);
    this.hamText = this.add.text(0, 0, "ham", {fill:"#000000", fontSize:"35px"});
    dictionary.addEntry("ham", "jamon", "jambon", "ham");

    // dragging code
    this.input.dragDistanceThreshold = 16;
    
    this.input.on('dragstart', function (pointer, gameObject) {
      //change this color later
      gameObject.setTint(0xff0000);
    });
  
    this.input.on('drag', function (pointer, gameObject, dragX, dragY) {
    gameObject.x = dragX;
    gameObject.y = dragY;
    });

    this.input.on('dragend', function (pointer, gameObject) {
    gameObject.clearTint();
    });
    
    this.orderDone = false;


    let foodarr = [["chicken", "pollo", "poulet"], ["bacon", "tocino", "bacon"], ["ham", "jamon", "jambon"]];
    let randFood = foodarr[Math.floor(Math.random() * 3)];

   

    // hard coded collisions
    this.physics.add.collider(this.bag, this.tomato, this.eatFood, function(bag, tomato){
      tomato.destroy(true);
    }, this);

    this.physics.add.overlap(this.bag, this.tomato, this.eatFood, undefined, this);

    this.physics.add.collider(this.bag, this.chicken, this.eatFood, function(bag, chicken){
      chicken.destroy(true);
    }, this);

    this.physics.add.overlap(this.bag, this.chicken, this.eatFood, undefined, this);

    this.physics.add.collider(this.bag, this.ham, this.eatFood, function(bag, ham){
      ham.destroy(true);
    }, this);

    this.physics.add.overlap(this.bag, this.ham, this.eatFood, undefined, this);

    this.physics.add.collider(this.bag, this.bacon, this.eatFood, function(bag, bacon){
      bacon.destroy(true);
    }, this);

    this.physics.add.overlap(this.bag, this.bacon, this.eatFood, undefined, this);

    //testing a random function for order sheet
    this.orderFood = ["chicken", "ham", "tomato", "bacon"];
    this.orderFoodText = [this.chickenText, this.baconText, this.hamText];

  
  



    // pausing the game
    let pause = this.add.bitmapText(1600, 1500, "pixelFont", "PAUSE", 100);
    pause.setInteractive({ useHandCursor: true });
    pause.on('pointerdown', () => this.pauseButton());

    let resume = this.add.bitmapText(1200, 1500, "pixelFont", "RESUME", 100);
    resume.setInteractive({ useHandCursor: true });
    resume.on('pointerdown', () => this.resumeButton());


  }



  pauseButton() {
    this.scene.pause('DeliveryScene');
  }

  resumeButton() {
    this.scene.resume('DeliveryScene');
  }

  iterFoodText(arr, size){
    let x: number = 65;
    let y: number = 100;
    for(var i:number = 0; i < size; i++){
      Phaser.Utils.Array.Shuffle(arr);
      arr[i].x = 0;
      arr[i].y = y;
      y += 50;
    }
  }

  iterFoodImage(arr){
    let x: number = 0;
    let y: number = 0;
    for(var i:number = 0; i <= arr.length; i++){
      Phaser.Utils.Array.Shuffle(arr);
      arr[i].x = 0;
      arr[i].y = Phaser.Math.Between(800, 850);
      this.moveFood(arr[i], 5);
      if(arr[i].x == 50){
        i++;
      }
    }
  }

  //moves food across screen
  moveFood(food, speed){
    food.x += speed;
    if(food.x > 2500){
      this.resetFood(food);
    }
  }

  //puts food back to beginning
  resetFood(food){
    food.x = 0;
    let randomY = Phaser.Math.Between(800, 850);
    food.y = randomY;
  }

  // destroys food that collides with bag
  eatFood(bag, food){
    food.destroy(true); 
    //this.beamSound.play();
    this.score += 5;
    this.scoreLabel.text = "SCORE " + this.score;
  }

  startDrag(pointer, targets){
    this.input.off('pointerdown', this.startDrag, this);
    this.foodDragged=targets[0];
    this.input.on('pointermove', this.doDrag, this);
    this.input.on('pointerup', this.stopDrag, this);

  }
  doDrag(pointer){
    this.foodDragged.x=pointer.x;
    this.foodDragged.y=pointer.y;
  }

  stopDrag(){
    this.input.on('pointerdown', this.startDrag, this);
    this.input.off('pointermove', this.doDrag, this);
    this.input.off('pointerup', this.stopDrag, this);
  }


  update() {
    this.moveFood(this.chicken, 4);
    this.moveFood(this.ham, 4);
    this.moveFood(this.bacon, 4);
    this.moveFood(this.tomato, 4);
    this.conveyor.tilePositionX -= 5;
    this.iterFoodText(this.orderFoodText, 3);
  }

  movePlayerManager(){
    
    if(this.cursorKeys.left.isDown){
      this.player.setVelocityX(-300);
    }
    else if(this.cursorKeys.right.isDown){
      this.player.setVelocityX(300);
    }
    else this.player.setVelocityX(0);

    if(this.cursorKeys.up.isDown){
      this.player.setVelocityY(-300);
    }
    else if(this.cursorKeys.down.isDown){
      this.player.setVelocityY(300);
    }
    else this.player.setVelocityY(0);
  }


}
