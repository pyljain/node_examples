const request = require('request')

var req_JSON = {
     "encodingType" : "UTF8",
     "document" : {
       "type": "PLAIN_TEXT",
       "content": `Enterprise Architecture methodology?
My current client is asking for help around typical "enterprise architecture" topics such as "how to determine buy vs. build" and
"which system do I use if I have multiple that have simila"`
     }
   }
// request('https://www.google.com', (err,response,body)=> {
//   console.log('***RESPONSE IS****', response)
//   console.error(err)
// })

// request : (Options: {},(String,{},String) => void) => void
request({
    uri:'https://language.googleapis.com/v1beta2/documents:analyzeEntities',
    method: 'POST',
    headers: {
      "Content-Type": 'application/json'
    },
    qs: {
      key: 'AIzaSyC5mqTxyRUg_YwbTtdIShlRCGOWUXKE8Eo'
    },
    json: req_JSON
}, (err, response, body) => {

  body.entities.forEach((entity) => {
    if(entity.type != 'OTHER'){
      console.log(entity.name)
    }
  })
})
