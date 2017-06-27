const fs = require('fs')
var fileToRead = ''
var fileToWrite = ''

const read = (fileToRead) => {
  
  return (() => {
    return new Promise((resolve, reject) => {
      fs.readFile(fileToRead, (err, contents) => {
        if (err) {
          reject(err)
        } else {
          console.log('File read, contents are', contents.toString())
          resolve(contents.toString())
        }
      })//enf fs.readFile
    })
  })

}

const write = (fileToWrite) => {

  return ((contentToWrite) => {
    return new Promise((resolve,reject) => {
      console.log('Contents passed to Write are', contentToWrite)
      fs.writeFile(fileToWrite, contentToWrite, () => {
        console.log('File updated successfully')
      })
    })
  })
}

module.exports = {
  read: read,
  write: write
}
