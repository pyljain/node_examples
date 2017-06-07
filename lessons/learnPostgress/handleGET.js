module.exports = handleGET
const query = require('./postgresclient')

function handleGET(socket, bookid) {

  query(`SELECT * FROM BOOKS WHERE ID = ${bookid}`, (result) => {
    var result_String = JSON.stringify(result.rows[0])
    socket.end(`HTTP/1.1 200 OK
                Connection: Close
                Content-Type: application/json
                Content-Length: ${result_String.length}

                ${result_String}`)
  })
}
