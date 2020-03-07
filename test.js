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
  // triggers error regarding calling methods without initializing
  function (callback) {
    try {
      const wordsPt3 = require('./index.js')
      wordsPt3.randomWord()
    } catch (e) {
      console.log('catching error on purpose:', e.message)
      callback()
    }
  },
  function (callback) {
    wordsPt.init(err => {
      if (err) {
        console.log(Error(err))
        process.exit(1)
      }
      console.log(wordsPt.getArray())

      if (wordsPt2.isWord('hello')) {
        callback(Error('word "hello" should not be here'))
        return
      }

      console.log(`A random word might be "${wordsPt.randomWord()}"`)
      var word1 = wordsPt.randomWord('a')
      var word2 = wordsPt.randomWord('abc')
      console.log(`Random words started respectively with [a] and [abc] are "${word1}" and "${word2}"`)
      if (!word1.startsWith('a') || !word2.startsWith('abc')) {
        callback(Error("randomWord('abc') should start with 'abc'"))
        return
      }

      console.log(`\nAll the words started with 'abc': ${wordsPt.getArray('abc')}\n`)

      var testArguments = [
        'ab, *, *', // => 'abcesso'
        'a , e, *', // 'abcesso' but not 'abade'
        '* , s, *', // 'espesso' but not 'sapato' nor 'mamas'
        '* , *, s', // 'mamas'
        't , *, s', // 'tetas'
        'se, o, s', // 'seios'
        'sa, a, to',
        'co, p, o',
        '*,  *, ão',
        '*,  *, iam',
        '*,  s, ta',
        't,  et, as'
      ]

      for (let i = 0; i < testArguments.length; i++) {
        let args = testArguments[i].split(',')
        args = args.map(arg => arg.trim())
        console.log(`The argumets (${args}) may result in '${wordsPt.randomWord.apply(wordsPt, args)}'`)
      }

      console.log(`\nOutput for wordsPt.getArray('t', 'et', 'as') is ${wordsPt.getArray('t', 'et', 'as')}\n`)
      console.log(`\nOutput for wordsPt.getArray('tetas', '*') is ${wordsPt.getArray('tetas', '*')}\n`)

      console.log(`\nThe biggest word is "${wordsPt.biggestWord()}"\n`)

      if (!wordsPt.isWord('Lisboa')) {
        callback(Error('Lisboa is a name and should be here'))
        return
      }

      callback()
    })
  },
  function (callback) {
    wordsPt2.init({ removeNames: true }, err => {
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
        return
      }

      if (wordsPt2.isWord('hello')) {
        callback(Error('word "hello" should not be here'))
        return
      }

      if (wordsPt2.isWord('Lisboa')) {
        callback(Error('Lisboa is a name and should not be here'))
        return
      }

      callback()
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
  // calls init with 3 arguments to trigger expected error
  function (callback) {
    wordsPt2.init(() => {
      try {
        wordsPt2.getArray('a', 'b', 'c', 'd')
      } catch (e) {
        console.log('catching error on purpose:', e.message)
        callback()
      }
    })
  },
  // calls init with 3 arguments to trigger expected error
  function (callback) {
    wordsPt2.init(() => {
      try {
        wordsPt2.getArray(1, 2, 3)
      } catch (e) {
        console.log('catching error on purpose:', e.message)
        callback()
      }
    })
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
        callback(Error('renaming step did not work successfully'))
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
