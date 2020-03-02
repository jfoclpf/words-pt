[![Build Status][travis_img]][travis_url]
[![Coverage Status](https://coveralls.io/repos/github/jfoclpf/words-pt/badge.svg?branch=master)](https://coveralls.io/github/jfoclpf/words-pt?branch=master)
[![Known Vulnerabilities](https://snyk.io/test/github/jfoclpf/words-pt/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jfoclpf/words-pt?targetFile=package.json)
[![Dependency Status][dependency status_img]][dependency status_url]
[![js-standard-style][js-standard-style_img]][js-standard-style_url]

[travis_img]: https://travis-ci.org/jfoclpf/words-pt.svg?branch=master
[travis_url]: https://travis-ci.org/jfoclpf/words-pt

[dependency status_img]: https://david-dm.org/jfoclpf/words-pt.svg
[dependency status_url]: https://david-dm.org/jfoclpf/words-pt

[js-standard-style_img]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg
[js-standard-style_url]: https://standardjs.com/

The list of all the words in Portuguese, including all possible combinations and variations (masculine, feminine, plural, singular, verbal conjugations, etc.). This is based on the great work from the professors of the University of Minho, and the all the files can be accessed [here](https://natura.di.uminho.pt/download/sources/Dictionaries/wordlists/).

## how to use
Install it

`npm i words-pt`

and then use the API

```js
const wordsPt = require('words-pt')

wordsPt.init({ removeNames: true } /* removes names such as 'Lisboa' */, function (err) {
  if (err) {
    // handle the error
    return
  }
  wordsPt.isWord('ser') // true
  wordsPt.isWord('serei') // true
  wordsPt.isWord('abafar-nos-ão') // true
  wordsPt.isWord('hello') // false
  let words = wordsPt.getArray() // array of words
  // do something more
})
```

## just the file

If you simply want for the plain file, wherein the words are separated by newlines, check the present file [wordsList.zip](wordsList.zip?raw=true). This unzipped file is encoded in `iso-8859-1`.
