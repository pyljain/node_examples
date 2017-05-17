const network = require('net')
var counter = 0

var client_tracker = []

const server = network.createServer((client) => {
  client_tracker.push(client)
}) //Close createServer


/*
  const myfn = (function add(x : Integer, y : Integer) {
    return x + y
  })();

  myfn : Integer

  const myfn = function add(x : Integer, y : Integer) {
    return x + y
  };

  myfn : (Integer, Integer) => Integer
*/

/*
  setInterval : (() => void, Integer) => Timeout
  List<A>.forEach : (A) => void
  network.createServer : (Socket => void) => Server
  server.listen : (Integer, String) => void
  filesystem.readFile : (String, (Error, String) => void) => void
  filesystem.appendFile : (String,String,(error) => void) => void
  filesystem.appendFileSync : (String|Buffer,String|Buffer,{}) => String|Buffer
*/

var pushCounterToClients = setInterval(() => {


  //counter = counter + 1

  counter += 1
  console.log(`Sending counter ${counter}`)

  client_tracker.forEach((eachClient) => {
    eachClient.write(counter.toString())
  })
}, 1000)

console.log('pushCounterToClients', pushCounterToClients);

//clearInterval(pushCounterToClients)

server.listen(9002, '127.0.0.1')
