const readline = require('readline')
const fs = require('fs')

const getUserInput = readline.createInterface ({
  input: process.stdin,
  output: process.stdout
})

getUserInput.question('What would you like to record?', recordInput)

function recordInput(userResponse) {

  const wtf = require('fs')
  fs.writeFile('./UserLog.txt', userResponse, () =>
  {
    console.log('File written Successfully')
    getUserInput.close()
    // fs.rename('./UserLog.txt', './movedUserLog.txt',
    //   (err) => console.log('Error Occurred', +err))

    //Copy content
    fs.writeFile('./writeanddelete.txt', userResponse,
    (err) => console.log('Error during writing and deleteing', +err))

    fs.unlink('./UserLog.txt',
    (err) => console.log('Unable to delete'))
  }

)}
