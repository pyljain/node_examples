const request = require('request')
const jwt = require('jsonwebtoken')
const BASE_URL = 'https://login.salesforce.com'

var key = require('fs').readFileSync('./privateKey.key', 'utf8')

var options = {
  issuer: '3MVG9HxRZv05HarSPq0qF3jdOU0q1EZc2CLeGgetWRE6B5PVUggRmRiPeOVKyV4p0gLwOu2ccmE7FSYmnMecs',
  audience: BASE_URL,
  expiresIn: 60*3,
  algorithm: 'RS256'
}

const login = (username, callback) => {
  const token = jwt.sign({ sub: username }, key, options)
  console.log('Making request')
  request.post({
    url: `${BASE_URL}/services/oauth2/token`,
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }
  }, (err, response, body) => {
    console.log('Response recieved', response)
    if (err) {
      console.error(err)
    } else {
      const bodyJSON = JSON.parse(body)
      const access_token = bodyJSON.access_token
      const instance_url = bodyJSON.instance_url
      callback(access_token, instance_url)

    }
  })
}

const createAccount = (access_token, instance_url, msg, callback) => {
  console.log('The message passed to create account is',msg.content.toString())
  var msgJSON = JSON.parse(msg.content.toString())

  request({
    url: `${instance_url}/services/data/v39.0/sobjects/Account/Data_Lake_ID__c/${msgJSON.accountnumber}`,
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${access_token}`
    },
    json: {
      name: `${msgJSON.firstName} ${msgJSON.lastName}`,
      email__c: msgJSON.email,
      gender__c: msgJSON.gender,
      deposit__c: msgJSON.deposit,
      Data_Lake_ID__c: msgJSON.accountnumber
    }
  }, (err, response, body) => {
   if (err) {
     console.error(err)
   } else {
     console.log('Account created', body.id)
     callback(body.id)
   }
  })
}



module.exports = {
  login: login,
  insertAccount: createAccount
}
