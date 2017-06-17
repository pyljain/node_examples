const express = require('express')
const app = express()

app.listen(9011, () => {
  console.log('Server ready')
})

const log = (req, res, next) => {
  console.log(new Date(), req.method, req.path)
  next()
}

const authenticate = (req, res, next) => {
  if(req.get('Authorization')) {
    if (req.get('Authorization') == '9999999') {
      next()
    } else {
      res.status(401).send('Invalid request')
      return null
    }
  } else {
    res.status(401).send('Invalid request')
    return null
  }
}

app.use(log)
app.use(authenticate)

app.get('/', (req, res) => {
  console.log('In GET')
  res.send('Hi there!')
})
