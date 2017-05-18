const network = require

var routes = {
  "/": "./home.html",
  "/hello": "./hello.html",
  "/bye": "./bye.html"
}

var home = `<html>
  <body>
    <h1>
      You are home
    </h1>
  </body>
</html>`;

var hello = `<html>
  <body>
  <h1>
    Hello
  </h1>
  </body>
</html>`;

var bye = `<html>
  <body>
    <h1>
      See you later
    </h1>
  </body>
</html>`;

const server = network.createServer((client) => {
  console.log('Client connected')
  client.on('data', (data) => {
    console.log('Received data from client')
    console.log(data.toString())

    const match = data.toString().match('GET\\s(.+)\\sHTTP/1.1');
    var html = normalHtml;

    if (match) {
      if (match[1] == '/importantResource') {
        html = specialHtml;
      }
    }

    client.end(`HTTP/1.x 200 OK
      Connection: Close

      ${html}`)
    })
  })

  server.listen(9004, '0.0.0.0')
