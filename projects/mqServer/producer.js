const mq = require('./mq')
var counter = 0

mq.connect(9006, '127.0.0.1', (server) => { //Use a callback because it will ensure that it is called only once connected

 setInterval(() => {
   server.write('Queue1', 'Sample Message'+counter)
   counter+=1
 },
 1000)


})
