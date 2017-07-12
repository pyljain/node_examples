const pg = require('pg')
const amqp = require('amqplib/callback_api')
const express = require('express')
const app = express()
const connectToQueue = require('./producer')
const mustacheExpress = require('mustache-express')
const CONSTANTS = require('./constants')
const client = new pg.Client(CONSTANTS.CONNECTION_OBJ)
const googleconfig = require('./config')
const bodyParser = require('body-parser')
const request = require('request')
const jwtDecoder = require('jwt-decode')
var id_token = ''
var decodedToken = ''
var channel = ''


//Step 1 is to create a postgress client. Once the connection
//is established then spin up the Server
app.engine('mustache', mustacheExpress())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')
app.use(express.static('libraries'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded())

client.connect((err) => {
  if (err) {
    throw err
  } else {
    app.listen(CONSTANTS.PORT, () => {
      console.log('Server is up')

      connectToQueue((ch) => channel = ch )

      var interval = setInterval(function() {
        checkPartneOBStatus(client, channel)
      }, 6000)
      
      // var interval = setInterval(function() {
      //   connectToQueue((ch) => {
      //     checkPartneOBStatus(client, ch)
      //   })
      // }, 6000)
    })
  }
})

app.get('/checkstatus', (req, res) => {
  console.log('In root URL')
  res.redirect(`https://accounts.google.com/o/oauth2/auth?client_id=${googleconfig.googleAuth.client_id}&redirect_uri=${googleconfig.googleAuth.callback_URL}&response_type=code&scope=email openid`)
  //var authCode = req.params.code
  //console.log('Auth Code is', authCode)
})

app.get('/home', (req, res) => {
  res.render('welcome')
})

app.post('/updatesteps', (req, res) => {
  var ptid = req.body.partner
  var status = req.body.value
  var stepId = req.body.dataid
  console.log('Req received', ptid, status, stepId)

  client.query(`UPDATE ONBOARDINGSTEPS SET STATUS = '${status}' WHERE
  ASSIGNEDTO_ID = '${ptid}' AND STEP_ID = ${stepId}`, (err, result) => {
    if (err) {
      console.log('Error received while updating step', err)
    } else {
      res.send('RECEIVED')
    }
  })

})

app.get('/youronboarding', (req, res) => {
  //console.log('In POST, Req received is', req)
  var authCode = req.query.code
  console.log('Auth Code is', authCode)

  var url = `${googleconfig.googleAuth.token_uri}`
  var payload = {
    grant_type: 'authorization_code',
    code: req.query.code,
    client_id: `${googleconfig.googleAuth.client_id}`,
    client_secret: `${googleconfig.googleAuth.client_secret}`,
    redirect_uri: `${googleconfig.googleAuth.callback_URL}`
  };

  request.post(url, { form: payload }, (error, response, body) => {
    console.log(body)
    if (error) {
      console.log('Error received from the token endpoint', error)
      res.send('ERROR OCCURED')
    } else {
      var body_JSON = JSON.parse(body)
      id_token = body_JSON.id_token
      decodedToken = jwtDecoder(id_token)
    //  console.log('ID Token is', decodedToken)
      console.log('Email address is', decodedToken.email)
      client.query(`SELECT STEP_ID,SUMMARY,ASSIGNEDTO_ID,STATUS FROM ONBOARDINGSTEPS
        WHERE ASSIGNEDTO_ID = (SELECT ID FROM PARTNERS WHERE EMAIL = '${decodedToken.email}')`,
        (err, result) => {
          if (err) {
            console.log(err)
          } else {
            if (result.rows) {

              var res_obj = {
                steps: result.rows.map(row => Object.assign({
                  isNotStarted: row.status == 'Not Started',
                  isInProgress: row.status == 'In Progress',
                  isCompleted: row.status == 'Completed'
                }, row))
              }
              //Object.assign is used to augment objects with new properties
              //that could be used to manipulate the UI. In this case to make
              //the mustache rendering conditional based on the picklist value
              //from the database

              res.render('welcome', res_obj)
            }
          }
        })
    }
  })

  //TO DO
  //res.send('COMPLETE')

})

const checkPartneOBStatus = (client, ch) => {
  const query_ob_status = `SELECT ID, FIRSTNAME, LASTNAME, OBSTATUS, PHONE_NUMBER
  FROM PARTNERS WHERE OBSTATUS = 'Not Started'`

  client.query(query_ob_status, (err, result) => {
    if (err) {
      console.log('PG ERROR', err)
    } else {
      if (result.rows) {
        var partnersToMessage = result.rows

        // partnersToMessage.forEach((partner) => {
        //   var partner = [{
        //     id: partner.id,
        //     firstname: partner.firstname,
        //     lastname: partner.lastname
        //   }]
        //
        //   partner_JSON.push(partner)
        // })

        partnersToMessage.forEach((partner) => {
          // partner_JSON[partner.id] = {firstname: partner.firstname, lastname: partner.lastname, obstatus: partner.obstatus}
          const objToSend = {
            firstName: partner.firstname,
            phone: partner.phone_number
          }
          console.log('Partner to Message is', objToSend)
          ch.assertQueue(CONSTANTS.QUEUE_NAME)
          ch.sendToQueue(CONSTANTS.QUEUE_NAME, new Buffer(JSON.stringify(objToSend)))
          //  console.log('Message Sent', new Buffer(JSON.stringify(objToSend)))
          client.query(`UPDATE PARTNERS SET OBSTATUS = 'In Progress' WHERE
          ID = '${partner.id}'`, (err, result) => {
            if (err) {
              throw err
            } else {
              console.log('Onboarding status updated for partner', partner.id)
            }
          })
        })
      }
    }
  })
}



























/*
CREATE TABLE partners(
id varchar(18) PRIMARY KEY,
firstname varchar(40),
lastname varchar(40),
obstatus varchar(60) default 'Not Started'
);

CREATE TABLE partners(
id varchar(18) PRIMARY KEY,
firstname varchar(40),
lastname varchar(40),
obstatus varchar(60) default 'Not Started'
);

CREATE TABLE Onboardingsteps (
step_id integer NOT NULL,
assignedto_id varchar(18),
summary varchar(100),
status varchar(60) default 'Not Started',
PRIMARY KEY (step_id, assignedto_id),
FOREIGN KEY (assignedto_id) REFERENCES partners (id)
);

INSERT INTO partners (id, firstname, lastname) VALUES
('P001', 'Cyri', 'Miri'),
('P002', 'Dieder', 'Woolf'),
('P003', 'Eli', 'Com'),
('P004', 'Felix', 'Lohan'),
('P005', 'Gyro', 'Didi'),
('P006', 'Pony', 'Shin');


INSERT INTO Onboardingsteps (step_id, assignedto_id, summary) VALUES
(1, 'P006', 'Meet the team'),
(2, 'P006', 'Submit forms'),
(3, 'P006', 'Understand our products'),
(4, 'P006', 'Submit your first lead'),
(5, 'P006', 'Innovate with us');





*/
