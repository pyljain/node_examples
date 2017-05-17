const network = require('net')
const fs = require('fs')
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var clients = []

const server = network.createServer((client) => {
  clients.push(client)
  if(clients.indexOf(client) == 0){
    var secretNumber = client.write(rl.question(`'Let us play.
    You are the first player.'+'\n'
    +'Guess a number in between 1 and 20'`, playGame))
  } //close if
  else {
    client.write(rl.question('Guess the magic number',playGame))
  }
}) //close createServer

function playGame(guess) {
  if(secretNumber > guess) {
    rl.question('Let us try again with a larger number? ', playGame);
  } else if (secretNumber < guess) {
    console.log('In lesser than condition');
    rl.question('Let us try again with a smaller number?', playGame);
  } else if(secretNumber == guess){
    console.log('In equal to condition');
    console.log('Bingo, you got it!');
    rl.close() //This needs to be in the condition as otherwise the engine goes on processing sequentially while function values
    //are processed synchronously.

  }
}

server.listen(9003, '127.0.0.1')
