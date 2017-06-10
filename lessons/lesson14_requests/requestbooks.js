const request = require('request')
//const handler = require('../learnPostgress/index')

var request_JSON = {
  "Id": 701,
  "Name": "Ramayana",
  "Author": "Rama"
}

// request({
//   uri: 'http://localhost:9031/book',
//   method: 'POST',
//   headers: {
//     "Content-Type": 'application/json'
//   },
//   json: request_JSON
// }, (err, response, body) => {
//   if (err)
//   console.error(err)
//   console.log('Response is', body)
// })
var counter = 0

for(counter = 0; counter < 60; counter++) {
  request('http://localhost:9031/book/701', (err,response,body) => {
    var bookJSON = JSON.parse(body)
    console.log('****GET COMPLETE', bookJSON["id"], bookJSON["name"], bookJSON["author"])

    console.log(err)

  })
}
