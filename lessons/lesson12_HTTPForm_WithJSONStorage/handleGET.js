const fs = require('fs')// handleGET : (Socket) => void

module.exports = function handleGET(socket) {
  fs.readFile('./hello.html', (err, contents) => {
    if(err) {
      console.log('An Error Occured', err)
    } else {
      socket.end(`HTTP/1.x 200 OK
                  Connection : Close

                  ${contents}`)

    }
  }) //Close readFile
}
