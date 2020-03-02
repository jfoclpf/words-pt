const fs = require('fs')
const path = require('path')
const async = require('async')
const extractZip = require('extract-zip')

var wordsArray

// file which is zip compressed on the repo, and the corresponding unzipped file
var wordsListZipFile = path.join(__dirname, 'wordsList.zip')
var wordsListFile = path.join(__dirname, 'wordsList')

module.exports = {

  init: function () {
    var options, mainCallback
    if (arguments.length === 1) {
      options = {}
      mainCallback = arguments[0]
    } else if (arguments.length === 2) {
      options = arguments[0]
      mainCallback = arguments[1]
    } else {
      throw Error(`method init has ${arguments.length} arguments, which is invalid`)
    }

    async.series([
      // unzip JSON file with user insertions
      function (callback) {
        extractZip(wordsListZipFile, { dir: __dirname }, function (errOnUnzip) {
          if (errOnUnzip) {
            callback(Error('Error unziping file ' + wordsListZipFile + '. ' + errOnUnzip.message))
          } else {
            console.log('List unzipped successfully')
            callback()
          }
        })
      },
      // test main calculator function
      function (callback) {
        // here the file was unzip successfully, the zip extractor removes the extension .zip
        fs.readFile(wordsListFile, 'latin1', function (err, data) {
          if (err) {
            callback(Error('Error reading file ' + wordsListFile + '. ' + err.message))
          } else {
            wordsArray = data.split('\n')
            // cleans array from empty or falsy entries
            wordsArray = wordsArray.filter(word => word)

            if (options.removeNames) {
              wordsArray = wordsArray.filter(word => {
                return word[0] !== word[0].toUpperCase()
              })
            }
            callback()
          }
        })
      },
      // remove unziped file
      function (callback) {
        removeUnzippedFile()
        callback()
      }
    ],
    function (err) {
      if (err) {
        removeUnzippedFile()
        mainCallback(Error(err))
      } else {
        mainCallback()
      }
    })
  },

  getArray: function () {
    return wordsArray
  },

  isWord (word) {
    return wordsArray.includes(word)
  }
}

function removeUnzippedFile () {
  if (fs.existsSync(wordsListFile)) {
    fs.unlinkSync(wordsListFile)
  }
}
