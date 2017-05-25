const net = require('net')

const server = net.createServer((socket) => {
  console.log('Client connected')
  socket.write('Hello client socket')

  socket.on('data',
    (data) => console.log('Message from client', data.toString()))
})

server.listen(8080, '0.0.0.0')
