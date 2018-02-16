<template>
  <div class="playerNameForm">
  	<label for="playerName">Write your name and press <span>ENTER</span></label>
  	<input v-model="playerName" ref="playerName" maxlength="20" type="text" id="playerName" placeholder="Enter your name" @keydown.enter="savePlayerName" @keydown.space.stop />
  </div>
</template>

<script>
  export default {
    name: 'player-name-screen',
    data () {
    	return {
    		playerName: ''
    	}
    },
    mounted () {
      // Gives focus on the playerName input text
      this.$refs.playerName.focus()
    },
    methods: {
    	savePlayerName () {
    		// Remove the extra spaces to avoid blank name
        this.playerName = this.playerName.trim()
        // If the name isn't empty we save it and start the game
    		if (this.playerName !== ''){
    			this.$emit('savePlayerName', this.playerName)
    		}
    	}
    }
  }
</script>

<style scoped>
	.playerNameForm {
		width: 350px;
    height: 100px;
    background: #848484; 
    text-align: center;
    position: relative;
    top:-320px;
    margin:auto;
    border-radius: 50px;
    padding-top: 16px;
    color: white;
	}
  .playerNameForm span {
    font-size: 20px;
    font-weight: bold;
  }
</style>