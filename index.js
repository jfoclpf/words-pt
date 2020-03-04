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
            console.log('List of words unzipped successfully')
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
    checkIfWordsArrayIsDefined()
    return wordsArray
  },

  isWord: function (word) {
    checkIfWordsArrayIsDefined()
    return wordsArray.includes(word)
  },

  randomWord: function (startString) {
    checkIfWordsArrayIsDefined()

    var tempArray = startString
      ? wordsArray.filter(word => word.startsWith(startString))
      : wordsArray

    // random item from tempArray
    return tempArray[Math.floor(Math.random() * tempArray.length)]
  },

  biggestWord: function () {
    checkIfWordsArrayIsDefined()

    var biggestWord = wordsArray[0]
    var numberOfWords = wordsArray.length
    for (let i = 0; i < numberOfWords; i++) {
      if (wordsArray[i].length > biggestWord.length) {
        biggestWord = wordsArray[i]
      }
    }

    return biggestWord
  }
}

function checkIfWordsArrayIsDefined () {
  if (!wordsArray) {
    throw Error('Please run first method "init" with a callback. See readme.md')
  }
}

function removeUnzippedFile () {
  if (fs.existsSync(wordsListFile)) {
    fs.unlinkSync(wordsListFile)
  }
}
