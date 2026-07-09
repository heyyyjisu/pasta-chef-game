"use strict";

const ingredients = [
  "🧄",
  "🧅",
  "🍅",
  "🧀",
  "🫒",
  "🌿",
  "🍷",
  "🍄",
  "🧂",
  "🌶️",
];

let word = "";
let wordSet;
let wordArr;

let guess = "";
let attemptsCount = 11;
let ingredientsCount = 0;
let guessedWord = new Set();
let gameIngredients = [];

fetch("./example-words.json")
  .then((res) => res.json())
  .then((data) => {
    word = data[Math.floor(Math.random() * data.length)];
    wordSet = new Set(word);
    wordArr = [...wordSet];
    gameIngredients = ingredients.slice(0, wordArr.length);
    getWord();
    renderPantry();
  });

function getWord() {
  let underscore = "";
  console.log(word);
  for (let i = 0; i < word.length; i++) {
    if (guessedWord.has(word[i])) {
      underscore += `<div>${word[i]}</div>`;
    } else {
      underscore += "<div>_</div>";
    }
  }
  document.querySelector(".word__underscore").innerHTML = underscore;
}

function renderPantry() {
  let ing = "";
  for (let i = 0; i < gameIngredients.length; i++) {
    ing += `<div class="pantry__item">${gameIngredients[i]}</div>`;
  }
  document.querySelector(".pantry").innerHTML = ing;
}

function addIngredients() {
  if (ingredientsCount >= ingredients.length) return;

  const ing = document.createElement("div");
  ing.textContent = gameIngredients[ingredientsCount];
  document.querySelector(".plate__ing").appendChild(ing);

  const pantryItems = document.querySelectorAll(".pantry__item");
  pantryItems[ingredientsCount].textContent = "";

  ingredientsCount += 1;
}

function addAttempts() {
  if (attemptsCount <= 0) return;
  attemptsCount -= 1;

  let attempts = "";
  attempts += `<div>attempts left: ${attemptsCount}</div>`;
  document.querySelector(".attempts").innerHTML = attempts;
  document.querySelector(".attempts").style.visibility = "visible";
}

function guessLetter(wordArr, guess) {
  if (wordArr.includes(guess)) {
    for (let i = 0; i < wordArr.length; i++) {
      if (wordArr[i] === guess) {
        guessedWord.add(guess);
        wordArr.splice(i, 1);
        addIngredients();
        getWord();
        disableKey(guess, true);
        break;
      }
    }
  } else {
    addAttempts();
    disableKey(guess, false);
    console.log(wordArr);
    console.log(attemptsCount);
  }
  if (attemptsCount <= 0) {
    console.log(`Failed`);
    attemptsCount = 6;
    document.querySelector(".modal").innerHTML = `<div class="modal__box">
    <div class="modal__emoji">💩🤌</div>
    <div class="modal__text">No pasta!</div>
    <button class="modal__playAgain" onclick="resetGame()">Play again!</button>
  </div>`;
    document.querySelector(".modal").classList.add("active");
  }
  if (wordArr.length === 0) {
    console.log(`Win!`);
    attemptsCount = 6;
    document.querySelector(".modal").innerHTML = `<div class="modal__box">
    <div class="modal__emoji">🍝</div>
    <div class="modal__text">Your pasta is ready!</div>
    <button class="modal__playAgain" onclick="resetGame()">Play again!</button>
  </div>`;
    document.querySelector(".modal").classList.add("active");
  }
}

function disableKey(letter, correct) {
  const buttons = document.querySelectorAll("button");
  buttons.forEach((btn) => {
    if (btn.textContent === letter) {
      btn.disabled = true;
      btn.classList.add(correct ? "correct" : "wrong");
    }
  });
}

function createKeyboard() {
  const keys = "abcdefghijklmnopqrstuvwxyz";
  let musicStarted = false;

  for (let i = 0; i < keys.length; i++) {
    const key = document.createElement("button");
    key.textContent = keys[i];
    key.addEventListener("click", function (e) {
      e.preventDefault();
      if (!musicStarted) {
        bgMusic.play();
        musicStarted = true;
      }
      guess = e.target.textContent;
      guessLetter(wordArr, guess);
    });
    document.querySelector(".keyboard").appendChild(key);
  }
}

function resetGame() {
  guess = "";
  attemptsCount = 6;
  ingredientsCount = 0;
  guessedWord = new Set();
  gameIngredients = [];

  fetch("./example-words.json")
    .then((res) => res.json())
    .then((data) => {
      word = data[Math.floor(Math.random() * data.length)];
      wordSet = new Set(word);
      wordArr = [...wordSet];
      gameIngredients = ingredients.slice(0, wordArr.length);
      getWord();
      renderPantry();
    });
  document.querySelector(".plate__ing").innerHTML = "";
  document.querySelector(".attempts").style.visibility = "hidden";
  document.querySelector(".modal").classList.remove("active");
  document.querySelector(".keyboard").innerHTML = "";
  createKeyboard();
}

createKeyboard();
getWord(wordArr);

document.addEventListener("keydown", function (e) {
  const letter = e.key.toLowerCase();
  if (letter.length === 1 && letter >= "a" && letter <= "z") {
    guessLetter(wordArr, letter);
  }
});

const bgMusic = new Audio("./assets/pasta-chef-soundtrack.mp3");
bgMusic.loop = true;
bgMusic.volume = 0.3;
