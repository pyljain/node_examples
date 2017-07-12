const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')

const connectToRabbitMQ = (callback) => {
  amqp.connect(CONSTANTS.URL, (err, conn) => {
    if (err) {
      console.log(err)
    } else {
      console.log('Connected to Rabbit MQ')
    }
    conn.createChannel((err, ch) => {
      if (err) {
        console.log(err)
      } else {
        callback(ch)
      }
    })
  })
}

module.exports = {
  connectToRabbitMQ: connectToRabbitMQ
}
