const express = require('express')
const app = express()
const fs = require('fs')
const multer = require('multer')
const upload = multer({
                        dest: 'uploads/'
                     })
const producer = require('./producer')
const CONSTANTS = require('./CONSTANTS')
const mustacheExpress = require('mustache-express')
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')
app.use(express.static('processedImages'))

app.post('/uploadfile', upload.single('uploadprofileImage'), (req, res) => {
  console.log('Req received is', req)
  fs.rename(
    req.file.destination + '/' + req.file.filename,
    req.file.destination + '/' + req.file.originalname
  )

  const reference = {
    fileName: req.file.originalname
  }
  res.render('thankyou', reference)
  //res.end('Your profile image is successfully uploaded, your reference is',req.file.filename )
  producer.connectToRabbitMQ((ch) => {
    var msgJSON = {
      'fileName': req.file.originalname,
      'dest': req.file.destination
    }

    var msgBuffer = new Buffer(JSON.stringify(msgJSON))
    ch.sendToQueue(CONSTANTS.QUEUE_NAME, msgBuffer)
    console.log('Message sent to MQ')
  })
})

app.get('/status/:fileName', (req, res) => {
  const fileName = req.params.fileName
  console.log('In Check Status, the file path is', `${__dirname}/processedImages/req.params.fileName`)
  if(fs.existsSync(`${__dirname}/processedImages/${fileName}`)){
    res.send('COMPLETE')
  } else {
    res.send('NOT READY')
  }
})

app.use(express.static('public'))

app.listen(9017, () => {
  console.log('Server ready')

})
