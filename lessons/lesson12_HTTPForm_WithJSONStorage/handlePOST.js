const fs = require('fs')

// handlePOST : (Socket) => void
function handlePOST(socket, data) {
  var storeClientInput = data.toString().match(/&(.+)$/g)
  console.log('YOUR FABOURITE IS', storeClientInput)
  fs.readFile('./Tracker.json', (err, currentContents) => {
    if(err){
      console.log('Error in reading current file')
    } else {
      const currentContents_JSON = updateFile(currentContents, storeClientInput)

      socket.end(`HTTP/1.x 200 OK
              Connection : Close

              <html>
                <body>
                  <table>
                    <tr>
                      <td>Color</td>
                      <td>Count</td>
                    </tr>
                    ${createTable(currentContents_JSON)}
                  </table>
                </body>
              </html>`)

    }
  })
}

// updateFile : (String, Buffer) => Object
function updateFile(currentContents, storeClientInput) {
  console.log('File read successfully', currentContents)
  var fav_col = storeClientInput[0].split('&')
  console.log('After splitting', fav_col[1])
  var parts = fav_col[1].split('=')
  var currentContents_JSON

  if(currentContents == null || currentContents == ''){
    currentContents_JSON={}
  } else {
    currentContents_JSON = JSON.parse(currentContents)
  }

  if(parts[1] in currentContents_JSON){
    currentContents_JSON[parts[1]] = (currentContents_JSON[parts[1]]) + 1
  } else {
    currentContents_JSON[parts[1]] = 1
  }
  fs.writeFile('./Tracker.json', JSON.stringify(currentContents_JSON), () => console.log('File Written'))

  return currentContents_JSON
}

// createTable: (Object) => String
function createTable(jsonObject) {
  var result = ''

  // Array.forEach : ((Any) => void) => void
  Object.keys(jsonObject).forEach((key) => {
    result += `
      <tr>
        <td>${key}</td>
        <td>${jsonObject[key]}</td>
      </tr>
    `
  })

  return result
}

module.exports = handlePOST
