const express = require('express')
const app = express()
const pg = require('pg')
const PORT = process.env.PORT || 9012

const client = new pg.Client({
  user: "cnaioccqnnsjhb",
  password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
  database: "d9nlk2tgtsgjrp",
  port: 5432,
  host: "ec2-23-23-234-118.compute-1.amazonaws.com",
  ssl: true
})

client.connect((err) => {
  if(err){
   throw err
  }
  app.listen(PORT, () => {
    console.log('Server Ready')
  })
})

const authenticate = (req, res, next) => {
  if(req.get('Authorization')) {
    if(req.get('Authorization').includes('Basic')) {
      var encoded_auth = req.get('Authorization').substring(6)
      var decoded_auth = new Buffer(encoded_auth, 'base64').toString()
      console.log('Decoded String is', decoded_auth)
      var splitauth = decoded_auth.split(":")
      var usernamerecd = splitauth[0]
      var passwordrecd = splitauth[1]

      const query = `SELECT USERNAME,PASSWORD FROM USERS WHERE USERNAME = '${usernamerecd}'
      AND PASSWORD = '${passwordrecd}'`
      console.log('QUERY IS', query)
      client.query(query, (err, results) => {
        console.log(err,results)
        if(err) {
          console.error(err)
        } else {
          if (results.rows[0]) {
            console.log(results)
            console.log('User found')
            next()
            return null
          } else {
            res.status(401).send('Incorrect credentials')
            return null
          }
        }
      })
    } else {
      res.status(401).send('Request does not have the correct header')
      return null
    }
  } else {
    res.status(401).send('Request does not have the correct header')
    return null
  }
}

app.use(authenticate)

app.get('/', (req, res) => {
  console.log('Received')
  res.send('What would you like to do today?')
})
