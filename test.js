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

      if (wordsPt2.isWord('hello')) {
        callback(Error('word "hello" should not be here'))
      }

      if (!wordsPt.isWord('Lisboa')) {
        callback(Error('Lisboa is a name and should be here'))
      } else {
        callback()
      }
    })
  },
  function (callback) {
    wordsPt2.init({ removeNames: true }, function (err) {
      if (err) {
        console.log(Error(err))
        process.exit(1)
      }
      console.log('Names removed from Array')
      console.log(wordsPt2.getArray())

      if (wordsPt2.isWord('hello')) {
        callback(Error('word "hello" should not be here'))
      }

      if (wordsPt2.isWord('Lisboa')) {
        callback(Error('Lisboa is a name and should not be here'))
      } else {
        callback()
      }
    })
  }],
function (err) {
  if (err) {
    console.error('Test failed')
    process.exit(1)
  } else {
    console.log('Test succeeded')
    process.exit(0)
  }
})
