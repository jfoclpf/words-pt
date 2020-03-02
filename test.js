const async = require('async')
const wordsPt = require('./index.js')
const wordsPt2 = require('./index.js')

async.series([
  function (callback) {
    wordsPt.init(function (err) {
      if (err) {
        console.log(Error(err))
        process.exit(1)
      }
      console.log(wordsPt.getArray())
      callback()
    })
  },
  function (callback) {
    wordsPt2.init({ removeNames: true }, function (err) {
      if (err) {
        console.log(Error(err))
        process.exit(1)
      }
      console.log(wordsPt2.getArray())
      callback()
    })
  }
])
