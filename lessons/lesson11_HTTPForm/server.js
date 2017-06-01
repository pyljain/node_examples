const net = require('net')
const fs = require('fs')

const server = net.createServer((socket) => {
  socket.on('data', (data) => {
    console.log('Client Connected, data is', data.toString())

    fs.readFile('./main.html', (err, fileData) => {
      if(err) {
        console.log(err)
      } else {
        socket.end(`HTTP/1.x 200 OK
                      Connection: Close

                      ${fileData}`)
      }
    })
    //CHECK IF POST
    var header = data.toString().match('(.+)\\s(.+)\\sHTTP/1.1')
    if (header) {
      if (header[1] =='POST'){
        var formInput = data.toString().match(/(.+)$/g) //will get the entire last line. $ is the end of the input
        console.log('Form Input is', formInput)
        var form_obj = {}
        formInput[0].split('&').forEach((formElement) => {
          var formElement_Split = formElement.split('=')
          form_obj[formElement_Split[0]] = formElement_Split[1]

        })
        console.log('Object created is', form_obj)
      }
    }


  })
})

server.listen(9010, '0.0.0.0')
