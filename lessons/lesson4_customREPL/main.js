const util = require('util');
const vm = require('vm');
const readline = require('readline')

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
})

var x = 2;
var y = 39;
var z = '42';

// const sandbox = {
//   animal: 'cat',
//   count: 2
// };

function loop() {
  rl.question('What would you like processed? ', processInput)
}


function processInput(codeInput) {
  // vm.runInThisContext('count += 1; name = "Test"', sandbox);
  output = eval(codeInput)
  // console.log(util.inspect(sandbox));
  //console.log(codeInput)
  console.log(output)
  loop();
  //rl.close()
}

loop();
