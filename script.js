"use strict";

const word = "apple";
const wordSet = new Set(word);
const wordArr = [...wordSet];

console.log(wordSet);

let guess = "";
let attempt = 0;

function getWordLength(wordArr) {
  let underscore = "";
  for (let i = 0; i < wordArr.length; i++) {
    underscore += "<div>_</div>";
  }
  document.querySelector(".word__underscore").innerHTML = underscore;
}

function guessLetter(wordArr, guess) {
  attempt += 1;
  for (let i = 0; i < wordArr.length; i++) {
    if (wordArr[i] === guess) {
      wordArr.splice(i, 1);
      break;
    }
  }
  console.log(wordArr);
  console.log(attempt);
  if (attempt >= 7) {
    console.log(`done`);
  }
  if (attempt < 7 && wordArr.length === 0) {
    console.log(`Win!`);
  }
}

getWordLength(wordArr);
guess = "x";
guessLetter(wordArr, guess);
guess = "q";
guessLetter(wordArr, guess);
guess = "h";
guessLetter(wordArr, guess);
guess = "t";
guessLetter(wordArr, guess);
guess = "o";
guessLetter(wordArr, guess);
guess = "z";
guessLetter(wordArr, guess);
guess = "b";
guessLetter(wordArr, guess);
