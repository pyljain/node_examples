const CONSTANTS = require('./constants')
const amqp = require('amqplib/callback_api')
const manageRabbitMQConnection = require('./manageRabbitMQConnection')
const fs = require('fs')
const gm = require('gm')

manageRabbitMQConnection.connectToRabbitMQ((ch) => {
  ch.consume(CONSTANTS.QUEUE_NAME, (msg) => {
    console.log('Message received by the client is', msg.content.toString())
    var msgJSON = JSON.parse(msg.content.toString())
    console.log('gm', `${__dirname}/${msgJSON.dest}${msgJSON.fileName}`)
    console.log('Path to write', `${__dirname}/processedImages/${msgJSON.fileName}`)
    gm(`${__dirname}/${msgJSON.dest}${msgJSON.fileName}`)
    .resize(240, 240)
    .noProfile()
    .write(`${__dirname}/processedImages/${msgJSON.fileName}`, (err) => {
      if (!err) console.log('done')
      else console.error(err)
    })
    ch.ack(msg)
  })
})
