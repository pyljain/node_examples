const amqp = require('amqplib/callback_api')
const CONSTANTS = require('./CONSTANTS')

const connectToRabbitMQ = (callback) => {
  amqp.connect(CONSTANTS.URL, (err, conn) => {
    if (err){
      console.log(err)
    } else {
      console.log('Producer connected to Rabbit MQ')
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
