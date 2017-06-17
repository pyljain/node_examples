const request = require('request')
const JWT = require('jsonwebtoken')

const BASE_URL = 'https://login.salesforce.com'

const key = require('fs').readFileSync('./privateKey.key', 'utf8')
const options = {
  issuer: '3MVG9HxRZv05HarSPq0qF3jdOU2KRM3dYJmTd3X0P4jxakYWWDqLMMsiRgdgY7EsWFMsvy9YkwfEIqsXJagd.',
  audience: BASE_URL,
  expiresIn: 60*3,
  algorithm: 'RS256'
}

const login = (username, callback) => {
  const token = JWT.sign({ sub: username }, key, options)
  request.post({
    url: `${BASE_URL}/services/oauth2/token`,
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }
  }, (err, response, body) => {

    if (err) {
      console.error(err)
    } else {
      const bodyJSON = JSON.parse(body)
      console.log(bodyJSON)
      const access_token = bodyJSON.access_token
      const instance_url = bodyJSON.instance_url

      callback(access_token, instance_url)
    }
  })
}

const fetchUsers = (accessToken, instanceURL, callback) => {

  request({
    url: `${instanceURL}/services/data/v39.0/query`,
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    qs: {
      q:'SELECT Username, ID FROM User WHERE ISACTIVE = TRUE'
    }
  }, (err, response, body) => {

    if (err) {
      console.error(err)
    } else {
      const users = JSON.parse(body)
      callback(users.records)
    }
  })
}

const createAccount = (accessToken, instanceURL, accountName, accountNumber, callback) => {

  request({
    url: `${instanceURL}/services/data/v39.0/sobjects/Account`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`
    },
    json: {
      name: accountName,
      accountNumber: accountNumber
    }
  }, (err, response, body) => {

    if (err) {
      console.error(err)
    } else {
      callback(body.id)
    }
  })
}

module.exports = {
  login: login,
  fetchUsers: fetchUsers,
  createAccount: createAccount
}
