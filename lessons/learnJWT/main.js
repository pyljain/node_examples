const JWT = require('jsonwebtoken')
const request = require('request')
const sfconnect = require('./sfinterface')


const key = require('fs').readFileSync('./privateKey.key', 'utf8')
const options = {
  issuer: '3MVG9HxRZv05HarSPq0qF3jdOU2KRM3dYJmTd3X0P4jxakYWWDqLMMsiRgdgY7EsWFMsvy9YkwfEIqsXJagd.',
  audience: 'https://ctaidentity-developer-edition.eu11.force.com/NapiliCommunity',
  expiresIn: 60*3,
  algorithm: 'RS256'
}

const token = JWT.sign({ sub: 'dodgywodgyidentity@cta.com' }, key, options)
// requesy.post -> ({}, (err, response, body) => void ) => void
request.post({
  url: 'https://ctaidentity-developer-edition.eu11.force.com/NapiliCommunity/services/oauth2/token',
  form: {
    grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
    assertion: token
  }
}, (err, response, body) => {
  const bodyJSON = JSON.parse(body)
  const access_token = bodyJSON.access_token
  const instance_url = bodyJSON.instance_url
  console.log('Access Token received', bodyJSON.instance_url)
  sfconnect(access_token, instance_url)
})
