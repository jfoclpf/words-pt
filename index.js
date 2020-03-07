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

  isWord: function (word) {
    checkIfWordsArrayIsDefined()
    return wordsArray.includes(word)
  },

  getArray: function () {
    checkIfWordsArrayIsDefined()

    var tempArray
    if (arguments.length === 0) {
      tempArray = wordsArray
    } else if (arguments.length === 1) {
      tempArray = getFilteredArray(arguments[0], '*', '*')
    } else if (arguments.length === 2) {
      tempArray = getFilteredArray(arguments[0], arguments[1], '*')
    } else if (arguments.length === 3) {
      tempArray = getFilteredArray(arguments[0], arguments[1], arguments[2])
    } else {
      throw Error(`Bad number of arguments: ${arguments.length}. This function takes at maximum 3 arguments`)
    }

    return tempArray
  },

  randomWord: function () {
    checkIfWordsArrayIsDefined()
    // transfer all the function arguments from randomWord to getArray
    var tempArray = this.getArray.apply(null, arguments)
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

// examples for this function
// ('ab', '*', '*') => 'abcesso'
// ('a', 'e', '*') => 'abcesso' but not 'abade'
// ('*', 's', '*') => 'espesso' but not 'sapato' nor 'mamas'
// ('*', '*', 's') => 'mamas'
// ('t', '*', 's') => 'tetas'
// ('se', 'o', 's') => 'seios'
function getFilteredArray () {
  for (let i = 0; i < 3; i++) {
    if (typeof arguments[i] !== 'string') {
      throw Error(`argument ${arguments[i]} must be a string`)
    }
  }

  var tempArray = wordsArray.filter((word) => {
    var output = true
    if (arguments[0] !== '*') {
      output = output && word.startsWith(arguments[0])
    }
    if (arguments[1] !== '*') {
      // strip beginning word and end of word
      const innerWord = word.slice(arguments[0].length, -1 * arguments[2].length)
      output = output && innerWord.includes(arguments[1])
    }
    if (arguments[2] !== '*') {
      output = output && word.endsWith(arguments[2])
    }

    return output
  })

  return tempArray
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
