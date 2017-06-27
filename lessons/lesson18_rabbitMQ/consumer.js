const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')

amqp.connect(CONSTANTS.URL, (err, conn) => {
  console.log('Consumer Connected')

  conn.createChannel((err, ch) => {
    if (err) throw err
    else {
      console.log('Channel created')
      ch.consume(CONSTANTS.QUEUE_NAME, (msg) => {
        console.log('Message Received is', msg.content.toString())
        ch.ack(msg)
      })
    }
  })
})
