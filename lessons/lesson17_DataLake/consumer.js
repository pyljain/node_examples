const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')
const salesforceAPI = require('./salesforceAPI')


amqp.connect(CONSTANTS.URL, (err, conn) => {
  if (err) throw err
  else {
    console.log('Consumer Connected')
  }
  conn.createChannel((err, ch) => {
    if (err) throw err
    else {
      console.log('Channel created')
      //Get JWT Token
      salesforceAPI.login(CONSTANTS.ADMIN_USER, (accessToken, instanceURL) => {

        console.log('Logged in to the API')

        ch.consume(CONSTANTS.QUEUE_NAME, (msg) => {
          console.log('Message received from queue', msg.content.toString())
          ch.ack(msg)
          salesforceAPI.insertAccount(accessToken, instanceURL, msg, (accountid) => {
            console.log('Account created', accountid)
          })
        }) //End ch.Consume
      })
    }
  })
})
