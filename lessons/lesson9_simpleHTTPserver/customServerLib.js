const net = require('net')
const fs = require('fs')
var request_mappings = {}

module.exports = {
  start: function(port){
    const server = net.createServer((socket) => {
      socket.on('data' , (data) => {

      const match = data.toString().match('GET\\s(.+)\\sHTTP/1.1')

      if(match){
        console.log('Match is', match)
        if(match[1] in request_mappings) {
          if(typeof request_mappings[match[1]] === 'string'){
            console.log('In String typeof',typeof request_mappings[match[1]])
            var filename = request_mappings[match[1]]

            fs.readFile(filename, (err,contents) => {
              if(err != null){
                console.log(err)
              } else {
                socket.end(`HTTP/1.x 200 OK
                  Connection: Close

                  ${contents}`)
              }
            })
          }
          else if (typeof request_mappings[match[1]] === 'function') {
            console.log('In function typeof',typeof request_mappings[match[1]])
            socket.end(`HTTP/1.x 200 OK
              Connection: Close

              ${request_mappings[match[1]]()}`)
          }
        }
      } else {
        socket.end(`HTTP/1.x 200 OK
          Connection: Close`)
      }

      }) //End socket listen
    }) //End createServer

    server.listen(port,'0.0.0.0')
    console.log('Server up and ready')

  }, //end Start function

  route: function(endpoint,action) {
    if(!(endpoint in request_mappings)){
      request_mappings[endpoint] = action
      console.log('Request Mappings', request_mappings)
    }
  }


} //Close Module.exports
