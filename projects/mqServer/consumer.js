const mq = require('./mq')

mq.connect(9006, '127.0.0.1', (server) => {
  server.listen('Queue1', (data) => {
    console.log('Data received', data)
  })
})
