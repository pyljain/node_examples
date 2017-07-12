const JWT = require('jsonwebtoken')
const rx = require('rxjs')
const request = require('request')


const connect = (baseurl, username, key, consumerkey) => rx.Observable.create((observer) => {
  const options = {
    issuer: consumerkey,
    audience: baseurl,
    expiresIn: 60*3,
    algorithm: 'RS256'
  }

  const token = JWT.sign({ sub: username }, key, options)

  request.post({
    url: `${baseurl}/services/oauth2/token`,
    form: {
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: token
    }
  }, (err, response, body) => {
    if (err) {
      observer.error(err)
    } else {
      observer.next(JSON.parse(body))
    }
  })
})

const insert = (conn, sobjectname, row ) => rx.Observable.create((observer) => {
  request({
    url: `${conn.instance_url}/services/data/v39.0/sobjects/${sobjectname}`,
    method: 'POST',
    headers: {
      Authorization: `Bearer ${conn.access_token}`
    },
    json: {
      name: row.firstname + '' + row.lastname,
      accountNumber: row.id
    }
  }, (err, response, body) => {

    if (err) {
      observer.error(err)
    } else {
      observer.next(body)
    }
  })
})

module.exports = {
  connect,
  insert
}
