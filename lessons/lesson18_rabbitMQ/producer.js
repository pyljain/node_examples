const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')

amqp.connect(CONSTANTS.URL, (err, conn) => {
  console.log('Producer Connected')

  conn.createChannel((err, ch) => {
    if (err) throw err
    else {
      console.log('Channel created')
      ch.sendToQueue(CONSTANTS.QUEUE_NAME, new Buffer('Test'))
      console.log('Message sent')
    }
  })
})
