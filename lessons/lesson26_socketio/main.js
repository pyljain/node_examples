const express = require('express')
const app = express()
const http = require('http').Server(app)
const io = require('socket.io')(http)
var clients = []

app.use(express.static('public'))

http.listen(9090, () => console.log('Server Started'))

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/main.html')
})

io.on('connection', (socket) => {
  console.log('Client Connected')
  clients.push(socket)
  socket.on('chat', (message) => {
    clients.forEach((client) => {
      client.emit('chat', message)
    })
  })
})

var counter = 0

setInterval(() => {
  clients.forEach((client) => {
    client.emit('chat', 'Hello' + counter)
    counter += 1
  })
}, 1000)
