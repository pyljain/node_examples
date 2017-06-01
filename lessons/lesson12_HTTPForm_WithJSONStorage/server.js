const net = require('net')
const handlePOST = require('./handlePOST')
const handleGET = require('./handleGET')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('Connection Established', data.toString())

    //Define what needs to have for POSTed form
    var header = data.toString().match(/(.+)\s(.+)\sHTTP/)
    if (header) {
      if (header[1] == 'POST') {
        handlePOST(socket, data)
      } else {
        handleGET(socket)
      }
    }
  })
})

server.listen(9015,'0.0.0.0')
