const pg = require('pg')
const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')
const twilio = require('twilio')
const client = new twilio(CONSTANTS.TWILIO_ACCOUNT, CONSTANTS.AUTHTOKEN)
console.log('Twilio client is', client)

consume((ch) => {
  //console.log('Channel is', ch)
})

function consume(callback) {
  amqp.connect(CONSTANTS.URL, (err, conn) => {
    if (err) {
      throw err
    } else {
      console.log('Worker Connected')
    }
    conn.createChannel((err, ch) => {
      if (err) {
        throw err
      } else {
        console.log('Worker channel connected')
        ch.assertQueue(CONSTANTS.QUEUE_NAME)
        ch.consume(CONSTANTS.QUEUE_NAME, (msg) => {
          var msg_JSON = JSON.parse(msg.content.toString())
          console.log('Name & Number is', {
              body: `Hello ${msg_JSON.firstName}`,
              to: msg_JSON.phone,
              from: '+441375352951'
            })
            ch.ack(msg)
          // if (msg_JSON.phone) {
          //   client.messages.create({
          //     body: `Hello ${msg_JSON.firstName}`,
          //     to: msg_JSON.phone,
          //     from: '+441375352951'
          //   })
          //   .then((message) => console.log('Message is', message.sid))
          // }
        //  console.log('Message received is ', msg.content.toString())
        }, {noAck: false})
        callback(ch)
      }
    })

  })
}

module.exports = consume
