<template>
  <div>    
    <board :class="{gameStoped: !gameRunning}"
           :boardMatrix="boardMatrix"
           :gameRunning="gameRunning"
           :headDirection="headDirection"
           :tailDirection="tailDirection"></board>
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
          currentDirection: 1, // Current direction (index of const DIRECTIONS) of the head of the snake
          snake: [], // The snake (coordinates)
          food: '', // The food (coordinates)
          speed: 150, // Speed in ms
          optionNoWall: true,
          speedChangeInterval: ''
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
        return boardMatrix
      },
      /**
       * Returns the score of the current game
       */
      score () {
        // Original snake size is 2
        return this.snake.length-2
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

        // Get the coordonates of the head of the snake
        const actualHead = this.snake[this.snake.length - 1]
        // Let's create the new head according to the current direction
        let newHead = [
          actualHead[0] + DIRECTIONS[this.currentDirection][0],
          actualHead[1] + DIRECTIONS[this.currentDirection][1]
        ]

        // If the new head is out of the Board game (and this is not the option elected) or if it did eat himself we end the game
        if ( (!this.isOnBoardGame(newHead) && !this.optionNoWall)
              || (this.isOnBoardGame(newHead) && this.isPartOfTheSnake(newHead))){
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
            // We replace food by snake
            this.boardMatrix[newHead[0]][newHead[1]] = 1
            // We generation a new food in the board
            this.generateFood()                 
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
       * Randomly creates food for the snake
       */
      generateFood () {
        const newFood = [
          Math.floor((Math.random() * this.boardSize) + 1),
          Math.floor((Math.random() * this.boardSize) + 1)
        ]
        if (this.isOnBoardGame(newFood) && !this.isPartOfTheSnake(newFood)){
          this.food = newFood
        } else {
          this.generateFood()
        }
      },
      /**
       * Checks if the new direction elected by the user is on the opposite side with the current direction
       * @param {number} Corresponds to the id of the DIRECTIONS vector
       * @returns {boolean} true if directions are opposite, false otherwise
       */
      isOppositeDirection (newDirection) {
          return (this.currentDirection + newDirection) % 2 === 0
      },
      /**
       * Checks if the element if a part of the snake
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if part of the snake, false otherwise
       */
      isPartOfTheSnake (elem) {
        return this.boardMatrix[elem[0]][elem[1]] === ( 1 || 3 || 4 )
      },
      /**
       * Checks if the element if food
       * @param {Array} Coordinates of the element
       * @returns {boolean} true if food, false otherwise
       */
      isFood (elem){
        return this.boardMatrix[elem[0]][elem[1]] === 2
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
      /**
       * Changes the current direction
       * @param {number} Corresponds to the id of the DIRECTIONS vector
       */
      changeDirection (newDirection) {
        if (!this.isOppositeDirection(newDirection) && this.currentDirection != newDirection){
              this.currentDirection = newDirection
          }
      },
      /**
       * Accelerates the speed of the snake every 25 seconds
       */
      changeSpeed (){
       this.speedChangeInterval = setInterval( () => { 
          if (this.speed >= 50){
            this.speed -= 10
          }
        }, 25000)
      },
      /**
       * Stops the game
       */
      stopGame () {
        // Stop the game
        this.gameRunning = false
        // Delete the food
        this.food = ''
        // Delete the snake
        this.snake = []
        // Stop the changeSpeed Interval
        clearInterval(this.speedChangeInterval)
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
        this.snake = [[5,5],[5,6]]     
        // Creates food on the board game
        this.generateFood()
        // Starts the game
        this.gameRunning = true
        // Put the snake in motion
        this.moveSnake()
        // Starts the changing speed time interval
        this.changeSpeed()
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
         // Left arrow
         if (keyPressed == 37){
            this.changeDirection(3)
         }
         // Up arrow
         if (keyPressed == 38){
            this.changeDirection(0)
         }
         // Right arrow
         if (keyPressed == 39){
            this.changeDirection(1)
         }
         // Down arrow
         if (keyPressed == 40){
            this.changeDirection(2)
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
    opacity: 0.85;
  }
</style>
