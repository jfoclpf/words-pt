[![Build Status][travis_img]][travis_url]
[![Coverage Status](https://coveralls.io/repos/github/jfoclpf/words-pt/badge.svg?branch=master)](https://coveralls.io/github/jfoclpf/words-pt?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/jfoclpf/words-pt/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jfoclpf/words-pt?targetFile=package.json)
[![js-standard-style][js-standard-style_img]][js-standard-style_url]

[travis_img]: https://travis-ci.org/jfoclpf/words-pt.svg?branch=master
[travis_url]: https://travis-ci.org/jfoclpf/words-pt

[js-standard-style_img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-style_url]: https://standardjs.com/

The list of all the words in Portuguese, including all possible combinations and variations (masculine, feminine, plural, singular, verbal conjugations, etc.). This is based on the great work from the professors of the University of Minho, and the all the files can be accessed [here](https://natura.di.uminho.pt/download/sources/Dictionaries/wordlists/).

## how to use
Install it

`npm i words-pt`

and then use the API

```js
const wordsPt = require('words-pt')

// { removeNames: true } removes names such as 'Lisboa' or 'António'
wordsPt.init({ removeNames: true }, err => {
  if (err) {
    // handle the error
    return
  }
  wordsPt.isWord('ser') // true
  wordsPt.isWord('serei') // true
  wordsPt.isWord('abafar-nos-ão') // true
  wordsPt.isWord('hello') // false

  wordsPt.randomWord() // grafonolas (any random word)
  wordsPt.randomWord('a') // amealhará (starting with 'a')
  wordsPt.randomWord('abc') // abcissa (starting with 'abc')
  // words.Pt.randomWord('abc') is equivalent to words.Pt.randomWord('abc', '*', '*')  

  // words.Pt.randomWord(beginningPart, middlePart, endPart)
  wordsPt.randomWord('ab', '*', '*') // 'abcesso'
  wordsPt.randomWord('a', 'e', '*') // 'abcesso' but not 'abade'
  wordsPt.randomWord('*', 's', '*') // 'espesso' but not 'sapato' nor 'mamas'
  wordsPt.randomWord('*', '*', 's') // 'mamas'
  wordsPt.randomWord('t', '*', 's') // 'tetas'
  wordsPt.randomWord('t', 'et', 'as') // 'tetanizarias'
  wordsPt.randomWord('se', 'o', 's') // 'seios'
  wordsPt.randomWord('sa', 'a', 'to') // 'salteamento'

  // exactly the same as randomWord, but gets all the words
  wordsPt.getArray() // array with all the words
  wordsPt.getArray('abc') // ['abcesso', 'abcessos', 'abcissa', 'abcissas']
  wordsPt.getArray('t', 'et', 'as') // ['tabuletas', 'tchetchenas', 'telefotometrias', 'telemetrias', ... ]
  wordsPt.getArray('tet', 'a', 's') // ['tetanizadas', 'tetanizados', 'tetanizais' , 'tetanizamos', ... ]

  words.Pt.biggestWord() // constitucionalizar-lhes-íamos
  // do something more
})
```

## just the file

If you simply want for the plain file, wherein the words are separated by newlines `\n`, check the present file [wordsList.zip](wordsList.zip?raw=true). The corresponding unzipped file is encoded in `iso-8859-1`.
