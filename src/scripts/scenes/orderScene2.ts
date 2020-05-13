import food from '../objects/food';
import bag from '../objects/bag';
import player from '../objects/player';
import { GameObjects } from 'phaser';
import {Entry} from '../objects/entry';
import {Dictionary} from '../objects/dictionary';

export default class orderScene2 extends Phaser.Scene {
  private deliveryscene;
  private orderscene;
  private tomato: food;
  private chicken: food;
  private chickenText;
  private bacon: food;
  private baconText;
  private ham: food;
  private hamText;
  private bag: bag;
  private paper: any;
  private orderDone: any;
  private food: string;
  private foods: Array<any>;
  private foodList: any;
  private foodDragged: any;
  private order: any;
  private table: any;
  private checkmark1: any;
  private checkmark2: any;
  private checkmark3: any;
  private xmark: any;
  orderFoodText;
  tempOrderFoodText;
  cursorKeys;
  score: number;
  scoreLabel;
  conveyor;
  private level: any;
  orderFood: any;
  tomatoText: GameObjects.Text;
  dictionary;

  constructor() {
    super({ key: 'orderScene2' });
    
  }

  create() {
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
    //this.add.text(60,100, "chicken (pollo)",{fill:"#000000", fontSize:"35px"});
    this.add.text(60,150, "tomato (tomate)",{fill:"#000000", fontSize:"35px"});
    this.add.text(60,100, "bacon (tocino)",{fill:"#000000", fontSize:"35px"});
    this.add.text(60, 400, "drag the food into\n the bag to\n fulfill the order", {fill:"#000000", fontSize:"40px"});

    this.checkmark1 = this.add.image(55, 105, "checkmark").setVisible(false);
    this.checkmark1.setScale(0.15);
    this.checkmark2 = this.add.image(55, 150, "checkmark").setVisible(false);
    this.checkmark2.setScale(0.15);
    this.checkmark3 = this.add.image(60, 105, "checkmark").setVisible(false);
    this.checkmark3.setScale(0.15);


    this.score = 0;
    this.scoreLabel = this.add.bitmapText(2000, 1500, "pixelFont", "SCORE", 100);

    //Vegetables
    this.tomato = this.physics.add.image(this.scale.width / 4 - 50, this.scale.height / 2, "tomato").setInteractive();
    this.input.setDraggable(this.tomato);
    this.tomatoText = this.add.text(0, 0, "tomato\n", {fill:"#000000", fontSize:"35px"}).setVisible(false);
    this.dictionary = new Dictionary();
    this.dictionary.addEntry("tomato", "tomate", "tomate", this.tomato);



    //Meats
    this.chicken = this.physics.add.image(this.scale.width / 50, this.scale.height / 2, "chicken").setInteractive();
    this.input.setDraggable(this.chicken);
    this.chicken.setScale(0.5);
    this.dictionary.addEntry("chicken", "pollo", "poulette", this.chicken, this.chickenText);
    //this.chickenText = this.add.text(0, 0, "chicken\n", {fill:"#000000", fontSize:"35px"}).setVisible(false);
    
    
    
    this.bacon = this.physics.add.image(this.scale.width / 3 - 50, this.scale.height / 2, "bacon").setInteractive();
    this.input.setDraggable(this.bacon);
    //this.baconText = this.add.text(0, 0, "bacon\n", {fill:"#000000", fontSize:"35px"}).setVisible(false);
    this.dictionary.addEntry("bacon", "tocino", "bacon", this.bacon);
    this.ham = this.physics.add.image(this.scale.width / 2 - 50, this.scale.height / 2, "ham").setInteractive();
    this.input.setDraggable(this.ham);
    this.ham.setScale(0.5);
    //this.hamText = this.add.text(0, 0, "ham\n", {fill:"#000000", fontSize:"35px"}).setVisible(false);
    this.dictionary.addEntry("ham", "jamon", "jambon", this.ham);

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
     this.physics.add.collider(this.bag, this.tomato, this.orderBag as ArcadePhysicsCallback, function(bag, tomato){
       null;
     }, this);

    this.physics.add.overlap(this.bag, this.tomato, this.orderBag as ArcadePhysicsCallback, undefined, this);

    this.physics.add.collider(this.bag, this.chicken, this.orderBag as ArcadePhysicsCallback, 
      function(bag, chicken){
       null;
      }, 
     this
    );

    this.physics.add.overlap(this.bag, this.chicken, this.orderBag as ArcadePhysicsCallback, undefined, this);

    this.physics.add.collider(this.bag, this.ham, this.orderBag as ArcadePhysicsCallback, function(bag, ham){
       null;
    }, this
    );

    this.physics.add.overlap(this.bag, this.ham, this.orderBag as ArcadePhysicsCallback, undefined, this);

    this.physics.add.collider(this.bag, this.bacon, this.orderBag as ArcadePhysicsCallback,
     function(bag, bacon){
       null;
     }, this
    );

    this.physics.add.overlap(this.bag, this.bacon, this.orderBag as ArcadePhysicsCallback, undefined, this);

    //testing a random function for order sheet
    //this.orderFood = [this.chicken, this.ham, this.tomato, this.bacon];
    
    //this.orderFoodText = [this.chickenText, this.baconText, this.hamText, this.tomatoText];

  
  



    // pausing the game
    let pause = this.add.bitmapText(1600, 1500, "pixelFont", "PAUSE", 100);
    pause.setInteractive({ useHandCursor: true });
    pause.on('pointerdown', () => this.pauseButton());

    let resume = this.add.bitmapText(1200, 1500, "pixelFont", "RESUME", 100);
    resume.setInteractive({ useHandCursor: true });
    resume.on('pointerdown', () => this.resumeButton());

    
    //this.iterFoodText(this.orderFoodText, 3);

  }

  pauseButton() {
    this.scene.pause('DeliveryScene');
  }

  resumeButton() {
    this.scene.resume('DeliveryScene');
  }

  // iterFoodText(arr, size){
  //   let x: number = 65;
  //   let y: number = 100;
  //   arr = Phaser.Utils.Array.Shuffle(arr);
  //   this.tempOrderFoodText = arr.slice(0, size);
  //   for(var i:number = 0; i < size; i++){
  //     arr[i].x = x;
  //     arr[i].y = y;
  //     y += 50;
  //     arr[i].setVisible(true);
  //   }
  // }

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
    this.score += 5;
    this.scoreLabel.text = "SCORE " + this.score;
  }

  nextScene(){
    if(this.checkmark1 && this.checkmark2){
      this.scene.switch('PreloadScene');
    }
  }
  //2 items: tomato, bacon
  orderBag(bag, food){
    
    if (food == this.tomato) {
      this.eatFood(bag, food);
      this.checkmark2.setVisible(true);
    }
    if (food == this.bacon){
      this.eatFood(bag, food);
      this.checkmark1.setVisible(true);
    }
    else{
      this.resetFood(food);
    }
  }

  update() {
    this.moveFood(this.chicken, 4);
    this.moveFood(this.ham, 4);
    this.moveFood(this.bacon, 4);
    this.moveFood(this.tomato, 4);
    this.conveyor.tilePositionX -= 4;
  }

}