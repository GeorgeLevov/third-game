(function(){

  var stage = document.querySelector("#stage");
  var output = document.querySelector("#output");
  var heading = document.querySelector("#heading");
// game map
var map = [
            [0, 1, 0, 0, 0, 3],
            [0, 0, 0, 0, 2, 0],
            [0, 0, 2, 0, 0, 0],
            [1, 0, 0, 0, 0, 1],
            [0, 0, 0, 2, 0, 0],
            [0, 0, 0, 0, 0, 0]
          ];
// objects map
var gameObjects = [
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 5, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [0, 0, 0, 0, 0, 0],
            [4, 0, 0, 0, 0, 0]
          ];

// map codes
var COSMOS = 0;
var TRADEPOST = 1;
var ALIEN = 2;
var HOME = 3;
var SHIP = 4;
var MONSTER = 5;

//size and space of the cells
var SIZE = 64;
var SPACE = 3;

//number of rows and cols
var ROWS = map.length;
var COLS = map[0].length;

//arrow key codes
var UP = 38;
var DOWN = 40;
var LEFT = 37;
var RIGHT = 39;

// keep track of position
var shipRow;
var shipCol;
var monsterRow;
var monsterCol;

for (var row = 0; row <ROWS; row ++){
  for (var col = 0; col <COLS; col ++){
    //tracking the ship row and col
    if(gameObjects[row][col] === SHIP){
      shipRow = row;
      shipCol = col;
    }
    if(gameObjects[row][col] === MONSTER){
      monsterRow = row;
      monsterCol = col;
    }
  }
}
console.log("ship row: " + shipRow);
console.log("ship col: " + shipCol);


//starting variables
var food = 10;
var spaceRocks = 10;
var experience = 0;
var gameMessage = "Use the arrow keys and make sure Matt makes it back home... Alive! ... and with at least one space rock.";

render();


//keydown event listener
window.addEventListener("keydown", keyDownHandler, false);

function keyDownHandler(event){
  switch(event.keyCode){
    case UP:
// check if ship's move is within the playing field
    if (shipRow > 0){
// clear the ship's current cell
      gameObjects[shipRow][shipCol] = 0;
//move ship
      shipRow = shipRow -1;
// apply the updated position to the array
      gameObjects[shipRow][shipCol]= SHIP;
    }
    break;

    case DOWN:
      if(shipRow < ROWS -1){
        gameObjects[shipRow][shipCol] = 0;
        shipRow = shipRow + 1;
        gameObjects[shipRow][shipCol]= SHIP;
      }
    break;

    case LEFT:
      if(shipCol > 0){
        gameObjects[shipRow][shipCol] = 0;
        shipCol = shipCol - 1;
        gameObjects[shipRow][shipCol]= SHIP;
      }
    break;

    case RIGHT:
      if(shipCol < COLS -1){
        gameObjects[shipRow][shipCol] = 0;
        shipCol = shipCol + 1;
        gameObjects[shipRow][shipCol]= SHIP;
      }
    break;
  }
// what cell is the ship on
  switch(map[shipRow][shipCol]){
    case COSMOS:
      console.log("You're just in space.");
      gameMessage = "Another day in outer space.<br/> Food left: "+ food + " <br/>Space rocks left: " + spaceRocks + "."
      break;

    case ALIEN:
      console.log("You meet aliens !");
      fight();
      break;

    case TRADEPOST:
      console.log("You're on an trade station.");
      trade();
      break;

    case HOME:
      console.log("You're home.");
      endGame();
      break;

    default:
      console.log("You're on an unknown space //error 102-97-103-103-111-116 ");
      break;
  }

    moveMonster();
    if(gameObjects[shipRow][shipCol] === MONSTER){
      endGame();
    }

    food = food -1;
    if(food <= 0 || spaceRocks <= 0){
      endGame();
    }



  render();
}


function moveMonster(){
//possible directions
  var UP = 1;
  var DOWN = 2;
  var LEFT = 3;
  var RIGHT = 4;
//store the valid directions
  var validDirections = [];
//final direction
  var direction = undefined;
//find out monster surroundings
  if (monsterRow > 0){
    var cellAbove = map[monsterRow -1][monsterCol];
    if (cellAbove === COSMOS){
      validDirections.push(UP);
    }
  }
  if (monsterRow < ROWS -1){
    var cellBelow = map[monsterRow +1][monsterCol];
    if (cellBelow === COSMOS){
      validDirections.push(DOWN);
    }
  }
  if (monsterCol > 0){
    var cellToLeft = map[monsterRow][monsterCol -1];
    if (cellToLeft === COSMOS){
      validDirections.push(LEFT);
    }
  }
  if (monsterCol < COLS -1){
    var cellToRight = map[monsterRow][monsterCol +1];
    if (cellToRight === COSMOS){
      validDirections.push(RIGHT);
    }
  }

// randomly choose a valid direction for the monster
  if(validDirections.length !== 0){
    var randomDirection = Math.floor(Math.random() * validDirections.length);
    direction = validDirections[randomDirection];
  }
  console.log(validDirections);
  console.log(randomDirection);
  console.log(direction);

 switch(direction){
//clear the monster's current cell and apply new position
   case UP:
     gameObjects[monsterRow][monsterCol] = 0;
     monsterRow = monsterRow - 1;
     gameObjects[monsterRow][monsterCol] = MONSTER;
     break;

   case DOWN:
     gameObjects[monsterRow][monsterCol] = 0;
     monsterRow = monsterRow + 1;
     gameObjects[monsterRow][monsterCol] = MONSTER;
     break;

   case LEFT:
     gameObjects[monsterRow][monsterCol] = 0;
     monsterCol = monsterCol - 1;
     gameObjects[monsterRow][monsterCol] = MONSTER;
     break;

   case RIGHT:
     gameObjects[monsterRow][monsterCol] = 0;
     monsterCol = monsterCol + 1;
     gameObjects[monsterRow][monsterCol] = MONSTER;
     break;

   default:
   console.log("The monster is trapped and can't move!");
    break;
 }


}

function trade(){
// how much food does the TRADEPOST have
  var tradeGoods = experience + spaceRocks;
  var cost = Math.ceil(Math.random() * tradeGoods );

// buy food if the player has enough money

  if (spaceRocks > cost){
    food = food + tradeGoods;
    spaceRocks = spaceRocks - cost;
    experience = experience + 1;

    gameMessage = "The trade planet offers you " + tradeGoods + " food for " + cost + " Space rocks.<br/> You accept the trade."
  }
  else{
// player doesn't have enough spaceRocks
    gameMessage = "The trade planet offers you " + tradeGoods + " food for " + cost + " Space rocks.<br/> You don't have enough Space rocks to make the trade."
  }
}

function fight(){
// ship strength
  var shipStrength = Math.ceil((food + spaceRocks) / 2);
// random between 1 and ship strength
  var alienStrength = Math.ceil(Math.random() * shipStrength * 2);
// check if aliens are stronger than you
  if(alienStrength > shipStrength){
    //aliens raid your ship
    var stolenSpaceRocks= Math.round(alienStrength / 2);
    spaceRocks = spaceRocks - stolenSpaceRocks;
// +1 xp for pitty , pitty bonus
    experience = experience + 1;

    gameMessage = "Ship's strength: " + shipStrength
      + "<br/>Aliens' strength: " + alienStrength + "<br/>You fight some aliens and LOSE " + stolenSpaceRocks + " space rocks in the process.";
  }
  else{
    var alienSpaceRocks = Math.round(alienStrength / 2);
    spaceRocks = spaceRocks + alienSpaceRocks;
    experience = experience + 3;

    gameMessage = "Ship's strength: " + shipStrength
    + "<br/>Aliens' strength: " + alienStrength + "<br/>You fight some aliens and WIN " + alienSpaceRocks + " space rocks, heck yes!"
    ;

  }
}

function endGame(){
  if (map[shipRow][shipCol] === HOME){
//total score for run
    var score = food + spaceRocks + experience;
    gameMessage="Hooray! Matt made it home!<br/> Now he can enjoy some space rock cereal.<br/>Final score: " + score;
    heading.innerHTML = "YOU WIN !";
  }
  else if(gameObjects[shipRow][shipCol] === MONSTER){
    gameMessage = "The spaceship has been swallowed by the interdimensional monster!";
    heading.innerHTML = "GAME OVER !";
  }
  else{
//player ran out of food or spaceRocks
    if(spaceRocks <= 0){
      gameMessage = gameMessage + "The ship's crew is furious and throws Matt out in space!";
      heading.innerHTML = "GAME OVER !";
    }
    else{
      gameMessage = "The ship has run out of food! Matt's space crew eats him to stay alive... nasty.";
      heading.innerHTML = "GAME OVER !";
    }
  }

  window.removeEventListener("keydown", keyDownHandler, false);

}

function render(){
// clear stage of img tag cells from the previous turn
  if(stage.children.length > 0){
    console.log("has Child Nodes");
    for(var i=0; i < ROWS * COLS; i++){
      stage.removeChild(stage.firstChild);
    }
  }
// look through the map arrays
  for (var row=0; row < ROWS; row ++)
  {
    for (var col=0; col < COLS; col ++)
    {
// creating the images
      var cell = document.createElement("img");
      cell.setAttribute("class","cell");
      stage.appendChild(cell);
// looping throught the map cells to find their images


      switch(map[row][col]){
        case COSMOS:
        console.log("You're in space.");
          break;

        case TRADEPOST:
          cell.src = "../images/trade-post.png";
        break;

        case ALIEN:
          cell.src = "../images/alien.png";
          break;

        case HOME:
          cell.src = "../images/mars-home.png";
          break;
      }

      switch(gameObjects[row][col])
      {
        case SHIP:
          cell.src = "../images/mattship.png";
          break;
        case MONSTER:
          cell.src = "../images/monster.png";
          break;


      }
// positioning the cells
      cell.style.top  = row * (SIZE + SPACE) + "px";
      cell.style.left  = col * (SIZE + SPACE) + "px";
    }
  }
//displaying the player stats:
console.log("Player Score: "+ (food+spaceRocks+experience));
console.log("Player food: "+ food);
console.log("Player gold: "+ spaceRocks);
console.log("Player XP: "+ experience);
  output.innerHTML = gameMessage;

  output.innerHMTL = output.innerHMTL + "<br/>Gold: " + spaceRocks + "<br/>Food: " + food + "<br/>Experience:" + experience;
}

}());
