const amqp = require('amqplib/callback_api')
const CONSTANTS = require('./constants')


module.exports = function connectToQueue(callback) {
  amqp.connect(CONSTANTS.URL, (err, conn) => {
    if (err) {
      throw err
    } else {
      console.log('Producer Connected')
    }
    conn.createChannel((err, ch) => {
      if (err) {
        throw err
      } else {
        // const queue = ch.assertQueue('OnboardingSMSStream')
        // if (queue){
        //     ch.sendToQueue(queue, msg)
        // }
        //console.log('Channel is', ch)
        callback(ch)
      }
    })
  })
}
