const network = require('net')
const fs = require('fs')

const routes = {
  "/": "./home.html",
  "/hello": "./hello.html",
  "/bye": "./bye.html"
}

// var home = `<html>
//   <body>
//     <h1>
//       You are home
//     </h1>
//   </body>
// </html>`;
//
// var hello = `<html>
//   <body>
//   <h1>
//     Hello
//   </h1>
//   </body>
// </html>`;
//
// var bye = `<html>
//   <body>
//     <h1>
//       See you later
//     </h1>
//   </body>
// </html>`;

const server = network.createServer((client) => {
  console.log('Client connected')
  client.on('data', (data) => {
    console.log('Received data from client')
    //console.log(data.toString())

    const match = data.toString().match('GET\\s(.+)\\sHTTP/1.1');
    // var html = normalHtml;
    //
    // if (match) {
    //   if (match[1] == '/importantResource') {
    //     html = specialHtml;
    //   }
    // }
    console.log('Match', match)

    if(match){
      if (match[1] in routes) {
        var filename = routes[match[1]];

        fs.readFile(filename, (err, contents) => {

          if(err != null) {
            console.log(err)
          } else {
            client.end(`HTTP/1.x 200 OK
              Connection: Close

              ${contents}`);
          }
        })
      } else {
        client.end(`HTTP/1.x 404 NOTFOUND
          Connection: Close`);
      }
    } else {
      client.end(`HTTP/1.x 404 NOTFOUND
        Connection: Close`);
    }
  })
})

server.listen(9004, '0.0.0.0')
