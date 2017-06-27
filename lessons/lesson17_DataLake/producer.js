const CONSTANTS = require('./CONSTANTS')
var amqp = require('amqplib/callback_api')

module.exports = function connectToQueue(callback) {
  amqp.connect(CONSTANTS.URL, (err, conn) => {
    if (err) throw err
    else {
      console.log('Producer Connected')
    }
    conn.createChannel((err, ch) => {
      if (err) throw err
      else {
        // console.log('Channel created')
        // ch.sendToQueue(CONSTANTS.QUEUE_NAME, msg)
        callback(ch)
      }
    })
  })
}
