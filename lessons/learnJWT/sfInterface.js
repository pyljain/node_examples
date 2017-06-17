const impersonateUser = require('./loginAsUser')
const request = require('request')
const express = require('express')
const app = express()
const mustache = require('mustache-express')
const bodyparser = require('body-parser')
const PORT = process.env.PORT || 9048
var accountid = ''
module.exports = getUsersfromSF
var users = []
var bodyJSONRecords = {}

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

app.listen(PORT, () => {
  console.log('Node Server Ready')
})

app.get('/', (req, res) => {

  var presentableJSON = {
    userlist: bodyJSONRecords
  }

  res.render('index2', presentableJSON)
})

app.get('/google', (req, res) => {
  res.redirect('https://www.google.com')
  // res.set('location', 'https://login.salesforce.com')
  // res.status(302).send('Redirect')
})


app.post('/', (req, res) => {

  var formInput = req.body //used the URLencoded body parser else this would not
  //be visible
  console.log('Form INPUT String', formInput)
  var selectedUser = req.body.username
  var accountname = req.body.account
  var accountnumber = req.body.accountnumber

  impersonateUser.loginAsUser(selectedUser, accountname, accountnumber, (body, accesstoken_user, access_URL) => {
     accountid = body.id
     var URL = `${access_URL}/secur/frontdoor.jsp?sid=${accesstoken_user}&retURL=/${accountid}`
     console.log('Constructed URL', URL)
     res.redirect(URL)
  })

})

function getUsersfromSF(accesstoken, instanceURL) {
  console.log('Access Token', accesstoken)
  console.log('Instance URL', instanceURL)

  request({
    uri:`${instanceURL}/services/data/v39.0/query`,
    baseURL:`${instanceURL}` ,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accesstoken}`
    },
    qs: {
      q:'SELECT Username, ID FROM User WHERE ISACTIVE = TRUE'
    }
  }, (err, response, body) => {
    //Do
    if(err) {
      console.error(err)
    } else {
      var bodyJSON = JSON.parse(body)
      bodyJSONRecords = bodyJSON.records
      console.log(bodyJSON)
      users = bodyJSON.records.map((user) => {
        return user.Username
      })
      //console.log('USERS', users)
    }
  }
)
}
