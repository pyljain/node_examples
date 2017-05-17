const network = require('net')

//All clients
var client_collection = []

const server = network.createServer((client) => {
  client_collection.push(client)
  console.log('Client connected')
  client.write('Hello client')
  client.on('data', (data) => {
    client_collection.forEach((each_client) =>{
      if(each_client != client)
        each_client.write(data.toString())
    })
  })
})



server.listen(9999, '127.0.0.1')
