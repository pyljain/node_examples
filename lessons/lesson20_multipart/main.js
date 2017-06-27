const express = require('express')
const multer  = require('multer')
const fs = require('fs')

const app = express()

const upload = multer({ dest: 'uploads/' })

app.post('/upload', upload.single('uploadedFiles'), (req, res) => {
  fs.rename(
    req.file.destination + '/' + req.file.filename,
    req.file.destination + '/' + req.file.originalname)
  res.end()
})

app.use(express.static('public'))


app.listen(8090, () => {
  console.log('Server Started')
})
