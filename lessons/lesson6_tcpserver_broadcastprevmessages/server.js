const network = require('net')
const filesystem = require('fs')

//Track clients in an array
var client_tracker = []

// Create server connection for a 'socket' i.e. client
const server = network.createServer((client) => {
  client_tracker.push(client)
  console.log(`Connection established for ${client}`)
  //Send server acknowledgement to client
  client.write(`Connection established for you ${client}`)
  //Publish Messages

  filesystem.readFile('./client_chatter.txt', (err, data) => {
    if (err) throw err
    if(client_tracker.length > 0){
      client_tracker.forEach((eachClient) => {
        if(eachClient == client)
        eachClient.write(data)
      })
    }
  })

  // Associate an event listener with the client, for when the
  //client sends a message to the server
  client.on('data', (data) => {
    filesystem.appendFile('./client_chatter.txt', data, (err) => {
      if (err) throw err
      console.log('Added to file')
      // filesystem.open('./client_chatter.txt', 'r', (err, contents) => {
      // filesystem.readFile('./client_chatter.txt', (err, datax) => {
      //   if (err) throw err
        if(client_tracker.length > 0){
          client_tracker.forEach((eachClient) => {
            if(eachClient != client)
            eachClient.write(data)
          }) //Closing forEach
        } //Closing IF

      // })
    }) //close write file
  }) //close client event for 'data'

  client.on('close', () => {
    console.log(`Connection to ${client} closed`)
    var index = client_tracker.indexOf("client")
    if(index != -1){
      client_tracker.splice(index,1)
      console.log('Client removed')
    }
  })
}) //close client connection establishment loop

server.listen(9001, '127.0.0.1')
