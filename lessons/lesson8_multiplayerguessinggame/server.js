const network = require('net')
const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var clients = []
var leaderIndex = 0
var secretNumber
var game_on = false

const server = network.createServer((client) => {
  clients.push(client)

  if(clients.indexOf(client) == 0){
    client.write(`
      Let us play.
      You are the first player.
      Guess a number in between 1 and 20`)
  } else {
    if(game_on == true)
      client.write('Let us start playing, guess the secret number')

  }

  client.on('data', function(data) {
    /*if (!leader)
      check if guess is correct.
      if guess correct send back you guessed it
    */

    if(clients.indexOf(client) == leaderIndex){
      secretNumber = parseInt(data.toString())
      console.log('The secretnumber is', secretNumber)
      game_on = true
      clients.forEach((player) => {
        if(player != client)
        player.write('Let us start playing. Guess a number between 1 and 20')
      })
    } else {
      if(game_on == false)
      {
        client.write('Was not expecting an input')
      } else if(game_on == true){
        guess = parseInt(data.toString())
        playGame(guess,client)
        console.log('Game on player guess', guess)
      }
    }
  });
  /*
    on data => check if the leader sends the data.
    If the leader sends the data start the game.
    Send other clients a message to start guessing
  */
}) //close createServer

function playGame(guess, client) {
  if(secretNumber > guess) {
    client.write('Let us try again with a larger number? ')
    console.log('Guess is', guess)
    console.log('Secret Number is', secretNumber)
  } else if (secretNumber < guess) {
    console.log('In lesser than condition')
    console.log('Guess is', guess)
    console.log('Secret Number is', secretNumber)
    client.write('Let us try again with a smaller number?')
  } else if(secretNumber == guess){
    console.log('In equal to condition')
    client.write('Bingo, you got it!');
    game_on = false
    leaderIndex = clients.indexOf(client)
    client.write(`
      Let us play.
      You are the winner!
      Guess a number in between 1 and 20 to play again`)
    clients.forEach((player) => {
      if(player != client)
      player.write(`
        The game is now over.
        The secret number was ${secretNumber}.
        Let us play again. Guess a number between 1 and 20`)

    }) //end forEach
    }

    //rl.close() //This needs to be in the condition as otherwise the engine goes on processing sequentially while function values
    //are processed synchronously.

  }


server.listen(9003, '127.0.0.1')
