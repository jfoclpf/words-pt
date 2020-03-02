[![Known Vulnerabilities](https://snyk.io/test/github/jfoclpf/words-pt/badge.svg?targetFile=package.json)](https://snyk.io/test/github/jfoclpf/words-pt?targetFile=package.json)
[![Dependency Status][dependency status_img]][dependency status_url]

[dependency status_img]: https://david-dm.org/jfoclpf/words-pt.svg
[dependency status_url]: https://david-dm.org/jfoclpf/words-pt

The list of all the words in Portuguese, including all possible combinations and variations (masculine, feminine, plural, singular, verbal conjugations, etc.). This is based on the great work from the professors of the University of Minho, and the all the files can be accessed [here](https://natura.di.uminho.pt/download/sources/Dictionaries/wordlists/).

# how to use
Install it

`npm i words-pt`

and then use the API

```js
const wordsPt = require('words-pt')

wordsPt.init({ removeNames: true } /* removes names such as 'Lisboa' */, function (err) {
  if (err) {
    console.error(err)
  } else {
    wordsPt.isWord('ser') // true
    wordsPt.isWord('serei') // true
    wordsPt.isWord('abafar-nos-ão') // true
    wordsPt.isWord('hello') // false
    let words = wordsPt.getArray() // array of words
    // do something more
  }
})
```
