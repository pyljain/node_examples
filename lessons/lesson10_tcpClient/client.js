const net = require('net')

const client_socket = new net.Socket()
client_socket.connect(8080, '0.0.0.0', () => {
      console.log('Connected to server')
      client_socket.write('Hello Server')
})

client_socket.on('data', (data) => {
  console.log('Data from server', data.toString())
})
