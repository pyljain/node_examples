const filesystem = require('fs')
// console.log = function(logcontents) {
//   // filesystem.writeFile('./fs_write.text', logcontents , () =>{})
//   filesystem.appendFile('./fs_write.text', logcontents + '\n' , () =>{})
//
// }
//
// console.log('Writing into an fs file')


const inputFileName = process.argv[2]
const outputFileName = process.argv[3]

filesystem.readFile(inputFileName, (err, contentsOfTheInputFile) => {

  if(err != null){
    console.log(err)
  } else {
    filesystem.writeFile(outputFileName, contentsOfTheInputFile,
      () => console.log('Successfully completed'))
  }
});
