module.exports = {
  loginAsUser : loginAsUser
}
const request = require('request')
var accesstoken_user = ''
var access_URL = ''

var account_id = ''

const key = require('fs').readFileSync('./privateKey.key', 'utf8')
const options = {
  issuer: '3MVG9HxRZv05HarSPq0qF3jdOU2KRM3dYJmTd3X0P4jxakYWWDqLMMsiRgdgY7EsWFMsvy9YkwfEIqsXJagd.',
  audience: 'https://login.salesforce.com',
  expiresIn: 60*3,
  algorithm: 'RS256'
}

function loginAsUser(username, account, accountnumber, callbackmain) {
  //Connect to Salesforce as the user to get the accesstoken

  console.log('IN LOGINASUSER, selectedUser is', username)
  const JWT = require('jsonwebtoken')
  const request = require('request')

  const token = JWT.sign({ sub: `${username}`}, key, options)

  request.post({
    url: 'https://login.salesforce.com/services/oauth2/token',
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }
  }, (err, response, body) => {
    if(err){
      console.error(err)
    } else {
      const SFresponse = JSON.parse(body)
      console.log('Response from Salesforce', SFresponse)
      accesstoken_user = SFresponse.access_token
      access_URL = SFresponse.instance_url
      console.log('Access token and instance URL are', accesstoken_user, access_URL)
      console.log('Before calling Account is', account, accountnumber)
      createAccount(accesstoken_user, access_URL, account, accountnumber, (body) => {
        console.log('Body in callback', body)
        callbackmain(body, accesstoken_user, access_URL)
      })

    }
  }
)
}

function createAccount(accesstoken_user, access_URL, account, accountnumber, callback) {
 var accountJSON = {
   "name": `${account}`,
   "accountnumber": `${accountnumber}`

 }

  request({
    uri: `${access_URL}/services/data/v39.0/sobjects/Account`,
    baseURL: `${access_URL}`,
    method: 'POST',
    headers: {
      "Authorization": `Bearer ${accesstoken_user}`,
      "Content-Type": "application/json"
    },
    json: accountJSON
  }, (err, response, body) => {
    if(err){
      console.error(err)
    } else {

      console.log('Response of account creation', body)
      account_id = body.id
      callback(body)

    }

  })
}
