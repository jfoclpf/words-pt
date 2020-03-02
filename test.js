const fs = require('fs')
const path = require('path')
const async = require('async')
const wordsPt = require('./index.js')
const wordsPt2 = require('./index.js')

// file which is zip compressed on the repo, and the corresponding unzipped file
var wordsListZipFile = path.join(__dirname, 'wordsList.zip')
var wordsListFile = path.join(__dirname, 'wordsList')

// for Test
var wordsListZipFile2 = path.join(__dirname, 'wordsList2.zip')

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

      // words that must exist
      var bool = wordsPt.isWord('abafar-nos-ão') &&
                 wordsPt.isWord('ser') &&
                 wordsPt.isWord('serás') &&
                 wordsPt.isWord('sê-lo-á') &&
                 wordsPt.isWord('estarei')

      if (!bool) {
        callback(Error('some words are not there, but they should'))
      }

      if (wordsPt2.isWord('hello')) {
        callback(Error('word "hello" should not be here'))
      }

      if (wordsPt2.isWord('Lisboa')) {
        callback(Error('Lisboa is a name and should not be here'))
      } else {
        callback()
      }
    })
  },
  // calls init with 3 arguments to trigger expected error
  function (callback) {
    try {
      wordsPt2.init({}, {}, {})
    } catch (e) {
      console.log('catching error on purpose:', e.message)
      callback()
    }
  },
  // renames words list zip file to trigger expected error
  function (callback) {
    fs.renameSync(wordsListZipFile, wordsListZipFile2)
    wordsPt2.init(function (err) {
      fs.renameSync(wordsListZipFile2, wordsListZipFile)
      if (err) {
        console.log('catching error on purpose:', err.message)
        callback()
      } else {
        callback(Error('renameing step did not work successfully'))
      }
    })
  }
],
function (err) {
  if (err) {
    console.error('Test failed')
    process.exit(1)
  } else {
    console.log('\x1b[32m', '\nTest succeeded\n')
    process.exit(0)
  }
})

// catches CTRL-C
process.on('SIGINT', function () {
  console.log('SIGINT detected, cleaning and exiting with error')
  // delete unzipped file if exists
  if (fs.existsSync(wordsListFile)) {
    fs.unlinkSync(wordsListFile)
  }
  // rename again to original
  if (fs.existsSync(wordsListZipFile2)) {
    fs.renameSync(wordsListZipFile2, wordsListZipFile)
  }
  process.exit(1)
})
