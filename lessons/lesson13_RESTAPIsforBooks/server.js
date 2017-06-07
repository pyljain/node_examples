const net = require('net')
const httpPOST = require('./handlePOST')
const httpGET = require('./handleGet')
const httpPATCH = require('./handlePATCH')
const httpDELETE = require('./handleDELETE')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('*****CONNECTED******', data.toString())

    var header = data.toString().match(/(.+)\s.+book(\/(.+))?\sHTTP/)
    if (header) {
     if(header[1] == 'GET') {
       var book_id = header[3]
       httpGET(socket, book_id)
     } else if (header[1] == 'POST') {
       httpPOST(socket, data)
     } else if (header[1] == 'PATCH') {
       var book_id = header[3]
       httpPATCH(socket, data, book_id)
     } else if (header[1] == 'DELETE') {
       console.log('Header is', header[1])
       var book_id = header[3]
       httpDELETE(socket, book_id)
     }
    }
  })
})

server.listen(9030, '0.0.0.0')
