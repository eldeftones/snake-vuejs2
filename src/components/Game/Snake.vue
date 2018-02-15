<template>
  <div>
    <board :class="{gameStoped: !gameRunning, showSpeedUp: showSpeedUpClass}"
           :boardMatrix="boardMatrix"
           :gameRunning="gameRunning"
           :headDirection="headDirection"
           :tailDirection="tailDirection"
           :colorSnake="colorSnake"></board>
    <div v-if="gameRunning" class="gameControl">
      <div class="flex">
        <player :playerName="playerName"></player>
        <score :score="score"></score>
       </div>
      
    </div>
    <options :optionNoWall="optionNoWall" @switchWallOption="switchWallOption"></options>

    <keep-alive>
      <component :class="{zoomIn: !gameRunning}"
                 :is="currentView"
                 @savePlayerName="savePlayerName"></component>
    </keep-alive>
    <div v-show="showSpeedUpClass" class="speedUp animated" :class="{bounceIn: showSpeedUpClass}">SPEEDING UP</div>

  </div>
</template>

<script>
  import Board from './Board'
  import Score from './Score'
  import Player from './Player'
  import Options from './Options'
  import StartGameScreen from '../Screens/StartGameScreen'
  import RestartScreen from '../Screens/RestartScreen'
  import PlayerNameScreen from '../Screens/PlayerNameScreen'

  const DIRECTIONS = [
    [-1,  0], // To the top
    [ 0,  1], // To the right
    [ 1,  0], // To the bottom
    [ 0, -1]  // To the left
  ]

  export default {
    name: 'snake',
    components: {
      Board, Score, RestartScreen, PlayerNameScreen, Player, StartGameScreen, Options
    },
    props: [
      'action'
    ],
    data () {
      return {
          gameRunning: false, // Indicates if the game is currently running
          currentView: 'player-name-screen', // Indicates which screen has to be shown (Player name form || Start game || Restart game)
          firstGame: true, // Indicates if it's the first game played this sesssion
          playerName: localStorage['playerName'] || '', // Player name
          boardSize: 26, // Size of the board game
          invertDirections: false, // Indicates if the directions are inverted or no
          currentDirection: 1, // Current direction (index of const DIRECTIONS) of the head of the snake
          nextDirectionsBuffer: [], // Registers the next directions, necessary if the user plays fast
          snake: [], // The snake (coordinates)
          colorSnake: 'green',
          food: '', // The food (coordinates)
          bonus: '', // The bonus (coordinates)
          wall: [],
          typeBonus: '',
          score: 0,
          speed: 150, // Speed in ms
          optionNoWall: true, // Option allowing the snake (or no) to go throw walls
          showSpeedUpClass: false // Indicates if we show (or no) the "changing speed" message
      }
    },
    computed: {
      boardMatrix () {
        // Create the matrix of the board game filled with 0 (0=nothing, 1=snake, 2=food)
        // Method fill() doesnt work on IE11 (Polyfill added in main.js to correct that)
        const boardMatrix = Array(this.boardSize).fill(0).map(() => Array(this.boardSize).fill(0))
        // Let's place the snake in the matrix      
        for (var i=0; i<this.snake.length; i++) {
          // Tail ot the snake
          if (i === 0){
            boardMatrix[this.snake[i][0]][this.snake[i][1]] = 4
          }
          // Head of the snake 
          else if ( i === this.snake.length-1){
            boardMatrix[this.snake[i][0]][this.snake[i][1]] = 3
          }
          // The corpse of the snake
          else {
            boardMatrix[this.snake[i][0]][this.snake[i][1]] = 1
          }
        }        
        // Let's place the food in the matrix if it exists
        if (this.food){
          boardMatrix[this.food[0]][this.food[1]] = 2
        }
        // Let's place the bonus in the matrix if it exists
        if (this.bonus){
          boardMatrix[this.bonus[0]][this.bonus[1]] = this.typeBonus
        }
        // Let's build the walls (trump bonus)
        if (this.wall){
          this.wall.forEach(function (wall){
            for (var i=0; i<wall.length; i++) {
              boardMatrix[wall[i][0]][wall[i][1]] = 9
            }
          })
        }
        return boardMatrix
      },
      /**
       * Indicates in which direction the the head has to be "steered"
       */
      headDirection () {
        if (this.snake.length > 1){
          // Coordinates of the tail of the snake
          let head = this.snake[this.snake.length-1]
          // Coordinates of the element juste before the tail of the snake
          let beforeHead = this.snake[this.snake.length-2]
          // Find in which direction the tail has to be
          return this.getOppositeDirection(beforeHead,head)
        }
      },
      /**
       * Indicates in which direction the tail has to be "steered"
       */
      tailDirection () {
        if (this.snake.length > 1){
          // Coordinates of the tail of the snake
          let tail = this.snake[0]
          // Coordinates of the element juste before the tail of the snake
          let beforeTail = this.snake[1]
          // Find in which direction the tail has to be
          return this.getOppositeDirection(tail,beforeTail)
        }
      }
    },
    methods: {
      /**
       * Save the player name in the local storage and switch to the start game screen
       */
      savePlayerName (name) {
        this.playerName = name
        localStorage['playerName'] = this.playerName
        this.currentView = 'start-game-screen'        
      },
      /**
       * Enable/Disable the "going throw walls" option
       */
      switchWallOption () { 
        this.optionNoWall = !this.optionNoWall
        if (this.gameRunning){
          this.gameOver()
        }
      },
      /**
       * Makes the snake move.
       * Recursive function : each call makes the snake move of one square 
       */
      moveSnake () {
        // If the game is over, we stop the cycle
        if (!this.gameRunning) { return }

        //  If there is new directions in the buffer...
        if (this.nextDirectionsBuffer.length > 0){
          // Get the next direction...
          this.currentDirection = this.nextDirectionsBuffer[0]
          // ... and remove it from the buffer
          this.nextDirectionsBuffer.shift()
        }

        // Get the coordinates of the head of the snake
        const actualHead = this.snake[this.snake.length - 1]
        // Let's create the new head according to the current direction
        let newHead = [
          actualHead[0] + DIRECTIONS[this.currentDirection][0],
          actualHead[1] + DIRECTIONS[this.currentDirection][1]
        ]

        // If the new head is out of the Board game (and this is not the option elected) or if it did eat himself we end the game
        if ( (!this.isOnBoardGame(newHead) && !this.optionNoWall)
              || (this.isOnBoardGame(newHead) && (this.isPartOfTheSnake(newHead) || this.isPartOfTrumpWall(newHead))) ) {
           this.gameOver()
        } else {
          // OPTION : Going throw walls
          if (this.optionNoWall && !this.isOnBoardGame(newHead)){
              // We place the head on the opposite side of the board
              newHead = this.placeTheHeadToOppositeSide(newHead)              
          }
          // Add the new head at the snake
          this.snake.push(newHead)
          // If the new head is at the same place that food...
          if (this.isFood(newHead)){
            // We increase the score
            this.score++            
            // We generation a new food in the board
            this.food = this.generateElem()                 
          }
          // If the new head is at the same place that a bonus..
          else if (this.isBonus(newHead)){
            // We increase the score according to the bonus
            this.increaseScoreWithBonusPoints(this.typeBonus)
            // Delete the bonus
            this.bonus = ''
            // We activate the effect of the bonus
            this.activateBonusEffect(this.typeBonus)
          }
          // Else we remove the tail of the snake so it remains at the same length
          else {           
            this.snake.shift()
          }          
        }

        // Recursive call to move the snake again at the current speed
        setTimeout(() => {            
            this.moveSnake()
        }, this.speed);
      },
      /**
       * Add the effects of the differents BONUS
       */
      activateBonusEffect (typeBonus) {
        // We stop the generation bonus default timeout
        clearTimeout(this.bonusGenerationTimeOut)

        // Simple bonus +5pts
        if (typeBonus === 5){
          this.generateBonus()
        }
        // Max speed for 20 sec
        else if (typeBonus === 6){
          // We change the color of the snake
          this.colorSnake = "red"
          // We save the current speed
          let oldSpeed = this.speed
          // We put the max speed
          this.speed = 40
          // In 10 sec we put back the normal speed, normal color and starts the generation bonus cycle
          this.currentGameTimeouts.push( setTimeout(() => {           
            this.speed = oldSpeed
            this.colorSnake = "green"
            this.generateBonus()
          }, 10000))
        }
        // Reverse directions (drunk snake)
        else if (typeBonus === 7){
          this.invertDirections = true
          this.colorSnake = "purple"
          // Put normal directions after 10sec and starts again the generation bonus cycle
          this.currentGameTimeouts.push( setTimeout(() => {           
            this.invertDirections = false
            this.colorSnake = "green"
            this.generateBonus()
          }, 10000))
        }
        // Trump effect - Building a wall
         // Reverse directions (drunk snake)
        else if (typeBonus === 8){
          this.generateWall()
          this.generateBonus()
        }
      },
      /**
       * Generate a wall on the board
       */
      generateWall () {
          // Get an empty cell on the board game
          this.elem = this.generateElem()
          // Add the brick to the wall
          this.wall.push([this.elem])         
          // Randomly decides if we build in which direction we build the wall
          this.randomDirection = Math.floor(Math.random() * 4)
          // Add ramdomly between 5 and 10 bricks
          for (let i = 0; i < Math.floor(Math.random()*6+5); i++){      
              this.elem = this.generateElemOnEmptyNeighbourCell(this.elem, this.randomDirection)
              if (this.elem != ""){
                this.wall[this.wall.length-1].push(this.elem)
              }
          }
          // After 30sec we erase the wall
          this.currentGameTimeouts.push( setTimeout(()=>{
              this.wall.shift()
          }, 30000) )
      },
      /**
       *
       */
      generateElemOnEmptyNeighbourCell (elem,direction) {          
          // Creates an element on the random direction
          let newElem = [
            elem[0] + DIRECTIONS[direction][0],
            elem[1] + DIRECTIONS[direction][1]
          ]
          // Check if the element is part of the board game AND if the cell is empty
          if (this.isOnBoardGame(newElem)
              && this.isEmptyOnBoardGame(newElem)){
            return newElem
          }
          return ""
      },
      
      /**
       * Returns the score according to the bonus
       */
      increaseScoreWithBonusPoints (bonus) {
        switch (bonus) {
          case 5: this.score = this.score + 5; break;
          case 6: this.score = this.score + 20; break;
          case 7: this.score = this.score + 30; break;
          case 8: this.score = this.score + 30; break;
        }
      },
      /**
       * Places an element near a border to its opposite (when the "going throw walls" option is selected)
       */
      placeTheHeadToOppositeSide (elem) {
          // From top to bottom border
          if (this.currentDirection === 0){
            elem[0] = this.boardSize-1
            return elem
          }
          // From right to left border
          if (this.currentDirection === 1){
            elem[1] = 0
            return elem
          }
          // From bottom to top border
          if (this.currentDirection === 2){
            elem[0] = 0
            return elem
          }
          // From left to right border
          if (this.currentDirection === 3){
            elem[1] = this.boardSize-1
            return elem
          }
      },
      /**
       * If the elem 2 is on the right of elem1, it indicates elem1 has to be steered to the left.
       * Etc.
       */
      getOppositeDirection (elem1, elem2){
        // The element is at the right, so point to the left
        if (elem2[1] < elem1[1]){
          return 3
        }
        // The element is at the left, so point to the right
        if (elem2[1] > elem1[1]){
          return 1
        }
        // The element is at the bottom, so point to the top
        if (elem2[0] < elem1[0]){
          return 0
        }
        // The element is at the top, so point to the bottom
        if (elem2[0] > elem1[0]){
          return 2
        }
      },
      /**
       * Randomly generates a new element on a empty cell of the boardGame
       */
      generateElem () {
        const newElem = [
          Math.floor((Math.random() * this.boardSize) + 1),
          Math.floor((Math.random() * this.boardSize) + 1)
        ]
        if (this.isOnBoardGame(newElem) && this.isEmptyOnBoardGame(newElem)){
         return newElem
        } else {
          return this.generateElem()
        }
      },
      /**
       * Generate the bonus
       */
      generateBonus () {
        // We remove the bonus (if not already eatean)
        this.bonus = ''
        
        // Wait 5sec before generating a new bonus
        this.bonusGenerationTimeOut = setTimeout(() => {
          // Generates a new element
          this.bonus = this.generateElem()
          // Ramdomly decides which bonus it will be
          this.typeBonus = Math.floor((Math.random() * 4) + 5)
          // The bonus will stay 5sec maximum          
          this.bonusGenerationTimeOut = setTimeout(() => {
            this.generateBonus()
          }, 5000)
        }, 5000)
      },
      /**
       * Checks if the new direction elected by the user is on the opposite side with the current direction
       * @param {number} Corresponds to the id of the DIRECTIONS vector
       * @returns {boolean} true if directions are opposite, false otherwise
       */      
      isOppositeDirection (direction1, direction2) {
        return (direction1 + direction2) % 2 === 0
      },
      /**
       * Checks if the elem is on an empty cell on the board game
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if the element is on an empty cell, no ortherwise
       */
      isEmptyOnBoardGame (elem) {
        return this.boardMatrix[elem[0]][elem[1]] === 0
      },
      /**
       * Checks if the element if a part of the snake
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if part of the snake, false otherwise
       */
      isPartOfTheSnake (elem) {
        return this.boardMatrix[elem[0]][elem[1]] === 1 
                || this.boardMatrix[elem[0]][elem[1]] === 3
                || this.boardMatrix[elem[0]][elem[1]] === 4
      },
      /**
       * Checks if the element if a part of the wall (trump bonus)
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if part of the wall, false otherwise
       */
      isPartOfTrumpWall (elem) {
        return this.boardMatrix[elem[0]][elem[1]] === 9 
      },
      /**
       * Checks if the element if food
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if food, false otherwise
       */
      isFood (elem){
        return this.boardMatrix[elem[0]][elem[1]] === 2
      },
      isBonus (elem){
        return this.boardMatrix[elem[0]][elem[1]] === 5 
                || this.boardMatrix[elem[0]][elem[1]] === 6
                || this.boardMatrix[elem[0]][elem[1]] === 7
                || this.boardMatrix[elem[0]][elem[1]] === 8
      },
      /**
       * Checks if an element is within the board game
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if the element is within, false otherwise
       */
      isOnBoardGame (elem) {
          if (elem[0] >= 0
              && elem[0] < this.boardSize
              && elem[1] >= 0
              && elem[1] < this.boardSize){
            return true
          } else {
            return false
          }
      },
      invertDirection (direction) {
        return (direction+2) % 4
      },
      /**
       * Changes the current direction
       * @param {number} Corresponds to the id of the DIRECTIONS vector
       */
      changeDirection (newDirection) {
          // If the Drunk bonus is activated we invert the direction
          if (this.invertDirections){
            newDirection = this.invertDirection(newDirection)
          }
          if (this.nextDirectionsBuffer.length === 0) {
             if (!this.isOppositeDirection(this.currentDirection, newDirection) && this.currentDirection != newDirection){              
                this.nextDirectionsBuffer.push(newDirection)
              }
          }
          else {
            if (!this.isOppositeDirection(newDirection, this.nextDirectionsBuffer[this.nextDirectionsBuffer.length-1])){              
              this.nextDirectionsBuffer.push(newDirection)
            }            
          }
      },
      /**
       * Accelerates the speed of the snake every 15 seconds until speed=40 and show the UP SPEED message
       */
      changeSpeed (){
       this.speedChangeInterval = setInterval( () => { 
          if (this.speed >= 50){
            // Show the SPEEDIN UP message
            this.showSpeedUpClass = true
            // Increases the speed
            this.speed -= 10
            setTimeout( () => {
              this.showSpeedUpClass = false
          }, 500)
          }
        }, 15000)
      },
      /**
       * Stops the game
       */
      stopGame () {
        // Stop the game
        this.gameRunning = false
        // Delete the food
        this.food = ''
        // Delete the bonus
        this.bonus = ''
        // Delete the snake
        this.snake = []
        // Delete the trump walls
        this.wall = []
        // Stop the changeSpeed Interval
        clearInterval(this.speedChangeInterval)
        // Stop the bonus generation
        clearTimeout(this.bonusGenerationTimeOut)
        // Stop the trump walls Timeouts
        this.currentGameTimeouts.forEach((timeOut) => {
          clearTimeout(timeOut)
        })
      },
      /**
       * Game Over : stop the game and show restart game screen
       */
      gameOver (){
        // Stops the game
        this.stopGame()
        // Show the game over / restart message
        this.currentView = 'restart-screen'
      },
      /**
       * Starts the game
       */
      startGame () {
        // Indicates that the next games are not the first one
        this.firstGame = false 
        // Define the starting speed
        this.speed = 150
        // Define the starting direction (to the right)
        this.currentDirection = 1 
        // Creates and show the snake
        this.snake = [[5,5],[5,6],[5,7],[5,8]]
        // Empty the buffer
        this.nextDirectionsBuffer = []
        // Creates food on the board game
        this.food = this.generateElem()  
        // Starts the game
        this.gameRunning = true
        // Put the snake in motion
        this.moveSnake()
        // Starts the changing speed time interval
        this.changeSpeed()
        // Starts the Bonus generation handling
        this.generateBonus()
        // Will contain all the timeouts to end when the game is over
        this.currentGameTimeouts = []
      }
    },
    watch: {
      action (keyPressed) {
         // Space - Start || Restart the game
         if (keyPressed == 32){
           // Start the game    
           if (this.playerName != '' && this.firstGame){
             this.currentView = ''
             this.startGame()
           }
           // Restart the game
           else {
             if (!this.gameRunning && !this.firstGame){
              this.currentView = ''
              this.startGame()
             }
            }
         }
         // Up arrow
         if (keyPressed === 38 || keyPressed === 87){
            this.changeDirection(0)
         }
         // Right arrow
         if (keyPressed === 39 || keyPressed === 68){
            this.changeDirection(1)
         }
         // Down arrow
         if (keyPressed === 40 || keyPressed === 83){
            this.changeDirection(2)
         }
         // Left arrow
         if (keyPressed === 37 || keyPressed === 65){
            this.changeDirection(3)
         }
      }
    }
  }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .gameControl {
    width: 520px;
    margin: auto;    
  }
  .flex {
    display: flex;
  }
  .gameStoped {    
    opacity: 0.95;
  }
  .showSpeedUp {
    background: black!important;
  }
  .speedUp {
    font-weight: bold;
    font-size: 50px;
    color: white;
    width: 520px;
    margin: auto;
    text-align: center;
    position: relative;
    top: -380px;
  }
</style>
