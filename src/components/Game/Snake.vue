<template>
  <div>    
    <board :class="{gameStoped: !gameRunning}" :boardMatrix="boardMatrix" :gameRunning="gameRunning"></board>
    <div v-if="gameRunning" class="gameControl">
      <player :playerName="playerName"></player>
      <score :score="score"></score>
    </div>
    <keep-alive>
      <component :class="{zoomIn: !gameRunning}" :is="currentView" @savePlayerName="savePlayerName"></component>
    </keep-alive>
  </div>
</template>

<script>
  import Board from './Board'
  import Score from './Score'
  import Player from './Player'
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
      Board, Score, RestartScreen, PlayerNameScreen, Player, StartGameScreen
    },
    props: [
      'action'
    ],
    data () {
      return {
          gameRunning: false, // Indicates if the game is currently running
          currentView: 'player-name-screen',
          firstGame: true,
          playerName: localStorage['playerName'] || '',
          boardSize: 26, // Size of the board game
          currentDirection: 1, // Current direction (index of const DIRECTIONS) of the head of the snake
          snake: [], // The snake (coordinates)
          food: '', // The food (coordinates)
          speed: 150 // Speed in ms
      }
    },
    computed: {
      /**
       * Creates, fills and return the matrix of the game every moment the snake or the food evolves
       */
      boardMatrix () {
        // Create the matrix of the board game filled with 0 (0=nothing, 1=snake, 2=food)
        // Method fill() doesnt work on IE11
        const boardMatrix = Array(this.boardSize).fill(0).map(() => Array(this.boardSize).fill(0))
        // Let's place the snake in the matrix
        for ( let coords of this.snake ){
          boardMatrix[coords[0]][coords[1]] = 1
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
      }
    },
    methods: {
      savePlayerName (name) {
        this.playerName = name
        localStorage['playerName'] = this.playerName
        this.currentView = 'start-game-screen'        
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
        const newHead = [
                actualHead[0] + DIRECTIONS[this.currentDirection][0],
                actualHead[1] + DIRECTIONS[this.currentDirection][1]
        ]
        // If the new head is out of the Board game or if it did eat himself we end the game
        if ( !this.isOnBoardGame(newHead) || this.isPartOfTheSnake(newHead)){
           this.gameOver()          
        } else {
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
        return this.boardMatrix[elem[0]][elem[1]] === 1
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
        }, 25000);         
      },
      /**
       * Stops the game
       */
      gameOver () {
        // Delete the food
        this.food = ''
        // Delete the snake
        this.snake = []
        // Show the game over / restart message
        this.currentView = 'restart-screen'
        // Stop the changeSpeed Interval        
        clearInterval(this.speedChangeInterval)
        // Stop the game
        this.gameRunning = false        
      },
      /**
       * Starts the game
       */
      startGame () {
        // Indicates that the next games are not the first one
        this.firstGame = false   
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
      },
      /**
       * Restarts the game
       */
      restartGame () {          
        // Define the new snake coordinates
        this.snake = [[5,5],[5,6]]
        // Define the starting direction (to the right)
        this.currentDirection = 1
        // Define the starting speed
        this.speed = 150
        // Start the game
        this.startGame()
       }
    },
    watch: {
      action (keyPressed) {
         // Space - Start / Restart the game
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
              this.restartGame()
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
    height: 70px;
    margin: auto;
    background: #525c59;
    display: flex;
  }
  .gameStoped {    
    opacity: 0.85;
  }
</style>
