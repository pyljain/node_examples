const pg = require('pg')
const net = require('net')
const httpGET = require('./handleGET')
const httpPOST = require('./handlePOST')

const client = new pg.Client({
  user: "cnaioccqnnsjhb",
  password: "e4f261adff7096f9bc1b367e0eaa916612a604436dd06d4d72d101496c690c70",
  database: "d9nlk2tgtsgjrp",
  port: 5432,
  host: "ec2-23-23-234-118.compute-1.amazonaws.com",
  ssl: true
})

// client.connect((err) => {
//   if (err) throw err
//   else {
//     client.query('SELECT ID, NAME FROM BOOKS', (err, result) => {
//       if (err) throw err
//       else {
//         result.rows.forEach((row) => {
//           console.log(row.name)
//         })
//         client.end()
//       }
//     })
//   }
// })

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('CONNECTED****', data.toString())

    var header = data.toString().match(/(.+)\s.+book(\/(.+))?\sHTTP/)
    if (header) {
      if (header[1] == 'GET') {
        var book_id = header[3]
        console.log('BOOK ID IS', book_id)
        httpGET(socket,book_id, client)
      } else if (header[1] == 'POST') {
        httpPOST(socket, client, data)
      }
    }
  })
})

server.listen(9031, '0.0.0.0')
// CREATE TABLE BOOKS (ID INT PRIMARY KEY, NAME TEXT, AUTHOR TEXT)
// INSERT INTO BOOKS VALUES (1, 'Fountainhead','Ayn Rand')
