const express = require('express')
const mustache = require('mustache-express')
const bodyparser = require('body-parser')

const salesforceAPI = require('./salesforceAPI')

const app = express()
const PORT = 8085 || process.env.PORT
const MAIN_USER = 'dodgywodgyidentity@cta.com'

app.use(bodyparser.json())
app.use(bodyparser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));

app.engine('mustache', mustache())
app.set('view engine', 'mustache')
app.set('views', __dirname + '/views')

salesforceAPI.login(MAIN_USER, (accessToken, instanceURL) => {
  salesforceAPI.fetchUsers(accessToken, instanceURL, (users) => {
    app.listen(PORT, () => {
      console.log('Service Started')
    })

    app.get('/', (req, res) => {
      console.log(users)
      res.render('index2', {
        userlist: users
      })
    })

    app.post('/', (req, res) => {
      const selectedUser = req.body.username
      salesforceAPI.login(selectedUser, (accessToken) => {
        salesforceAPI.createAccount(accessToken, instanceURL, req.body.account, req.body.accountnumber, (accountId) => {
          const URL = `${instanceURL}/secur/frontdoor.jsp?sid=${accessToken}&retURL=/${accountId}`
          console.log('Constructed URL', URL)
          res.redirect(URL)
        })
      })
    })
  })
})
