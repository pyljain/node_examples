
const jwtapi = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      console.log('In JWTAPI')
      resolve('sjskk030301-39292')
    }, 1000)
  })
}

const accountCreationAPI = (accessToken) => {

  return new Promise((resolve,reject) => {
    console.log('Calling account creation API with accessToken', accessToken)
    setTimeout(() => {
      console.log('In accountCreationAPI setTimeout')
      resolve('003udiduiduud2309')
    }, 1000)
  })
}

const accountUpdateAPI = () => {

  return new Promise((resolve, reject) => {
    console.log('Before calling setTimeout in accountUpdateAPI')
    setTimeout(() => {
      console.log('In setTimeout of accountUpdateAPI')
      resolve()
    }, 2000)
  })
}

jwtapi()
  .then(accountCreationAPI)
  .then((v) => {
    return Promise.all([accountCreationAPI(v), accountUpdateAPI(v)])
    //Promise.race does not wait for all functions to complete and calls the next step
    //with the one that completes first. Could be used instead of Promise.all when applicable
  })
  .then((result) => console.log('All Done', result))

// promisefs.read('./test.txt')
//   .then(fileContents => console.log(fileContents))
//
// promisefs.read('./test.txt')
//   .then(promisefs.write('./testcopy.txt'))
//   .then(() => {
//     console.log('Completed')
//   })
// promisefs.read('./test.txt')
//   .then(fileContents => console.log(fileContents))
//
// Promise.all(promisefs.read('./test.txt'), promisefs.read('./test1.txt'))
//   .then((arr) => {
//     console.log(arr)
//   })
