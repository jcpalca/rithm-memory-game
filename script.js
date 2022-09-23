"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const startGameWindow = document.querySelector(".start-game-window");
const startBtn = document.querySelector(".start-game-button");
const numCards = document.querySelector(".num-cards");
const totalShadow = document.querySelector(".total-shadow");
const bestScore = document.querySelector(".best-score");
const bestTime = document.querySelector(".best-time");
const guesses = document.querySelectorAll(".score");
const gameTimer = document.querySelectorAll(".timer")
const resetLeaderboard = document.querySelector(".reset-leaderboard");
const winScreen = document.querySelector(".win");
const restartBtn = document.querySelector(".restart");
const backToStart = document.querySelector(".back-to-start");
const FOUND_MATCH_WAIT_MSECS = 1000;
let COLORS = [];
let COLORSCOPY = [];
let firstFlip = false;
let firstCard;
let secondCard;
let pauseGame = false;
let num = 0;
let checkGameOver;
let timer;
let totalSeconds = 0;
let timeTextContent;

numCards.addEventListener("input", isValidNum);
startBtn.addEventListener("click", startGame);
restartBtn.addEventListener("click", restartGame);
backToStart.addEventListener("click", returnToStart);
resetLeaderboard.addEventListener("click", resetScore);

function generateRandomColor() {
  const randomColor = "#" + Math.floor(Math.random() * 16777215).toString(16).padStart(6, "0").toUpperCase();
  return randomColor;
}

function addRandomColor() {
  for(let i = 0; i < numCards.value / 2; i++) {
    COLORS.push(generateRandomColor());
  }
  copyColor();
  pasteColor();
}

function copyColor() {
  for(let color of COLORS) {
    COLORSCOPY.push(color);
  }
}

function pasteColor() {
  for(let color of COLORSCOPY) {
    COLORS.push(color);
  }
}

function isValidNum() {
  if(+numCards.value % 2 !== 0 || +numCards.value === 0 || +numCards.value < 8 || +numCards.value > 16) {
    startBtn.disabled = true;
  }
  else {
    startBtn.disabled = false;
  }
}

function startGame() {
  startGameWindow.style.display = "none";
  totalShadow.style.display = "block";
  addRandomColor();
  createCards(shuffle(COLORS));
  isFirstGame();
  checkGameOver = window.setInterval(isGameOver, FOUND_MATCH_WAIT_MSECS);
  timer = window.setInterval(countTimer, FOUND_MATCH_WAIT_MSECS)
}

/** Shuffle array items in-place and return shuffled array. */

function shuffle(items) {
  // This algorithm does a "perfect shuffle", where there won't be any
  // statistical bias in the shuffle (many naive attempts to shuffle end up not
  // be a fair shuffle). This is called the Fisher-Yates shuffle algorithm; if
  // you're interested, you can learn about it, but it's not important.

  for (let i = items.length - 1; i > 0; i--) {
    // generate a random index between 0 and i
    let j = Math.floor(Math.random() * i);
    // swap item at i <-> item at j
    [items[i], items[j]] = [items[j], items[i]];
  }

  return items;
}

/** Create card for every color in colors (each will appear twice)
 *
 * Each div DOM element will have:
 * - a class with the value of the color
 * - a click event listener for each card to handleCardClick
 */

function createCards(colors) {
  const gameBoard = document.getElementById("game");
  for (let color of colors) {
    // missing code here ...
    let card = document.createElement("div");
    card.classList.add("card", "unflipped");
    card.dataset.color = color;
    card.addEventListener("click", handleCardClick);
    card.style = `background-color: ${color};`;
    gameBoard.append(card);
  }
  return gameBoard;
}

/** Flip a card face-up. */

function flipCard() {
  // ... you need to write this ...
  if(firstFlip) {
    firstCard.classList.remove("unflipped");
  }
  else {
    secondCard.classList.remove("unflipped");
  }
}

/** Flip a card face-down. */

function unFlipCards() {
  // ... you need to write this ...
  pauseGame = true;
  setTimeout(() => {
    firstCard.classList.add("unflipped");
    secondCard.classList.add("unflipped");
    pauseGame = false;
  }, FOUND_MATCH_WAIT_MSECS)
}

/** Handle clicking on a card: this could be first-card or second-card. */

function handleCardClick() {
  // ... you need to write this ...
  if(pauseGame || this === firstCard) {
    return;
  }
  if(!firstFlip) {
    firstFlip = true;
    firstCard = this;
    flipCard();
  }
  else {
    firstFlip = false;
    secondCard = this;
    flipCard();
    checkForMatch();
    num++;
    updateScore();
  }
}

function checkForMatch() {
  if(firstCard.dataset.color === secondCard.dataset.color) {
    disableCards();
  }
  else {
    unFlipCards();
  }
}

function disableCards() {
  firstCard.removeEventListener("click", handleCardClick);
  secondCard.removeEventListener("click", handleCardClick);
}

function updateScore() {
  for(let guess of guesses) {
    guess.textContent = num;
  }
}

function isFirstGame() {
  if(window.localStorage.length === 0) {
    window.localStorage.setItem("score", 999999999);
    window.localStorage.setItem("time", 999999999);
    window.localStorage.setItem("timeFormatted", undefined)
  }
  else {
    if(window.localStorage.getItem("score") >= 999999999) {
      bestScore.textContent = "";
    }
    else {
      bestScore.textContent = window.localStorage.getItem("score");
    }
    bestTime.textContent = window.localStorage.getItem("timeFormatted");
  }
}

function updateBestScore() {
  if(num < window.localStorage.getItem("score")) {
    window.localStorage.setItem("score", num);
    bestScore.textContent = window.localStorage.getItem("score");
  }
}

function updateBestTime() {
  if(totalSeconds < window.localStorage.getItem("time")) {
    window.localStorage.setItem("time", totalSeconds);
    window.localStorage.setItem("timeFormatted", timeTextContent)
    bestTime.textContent = timeTextContent;
  }
}

function resetScore() {
  window.localStorage.clear();
  window.localStorage.setItem("score", 999999999);
  window.localStorage.setItem("time", 999999999);
  window.localStorage.setItem("timeFormatted", undefined)
  bestScore.textContent = "";
  bestTime.textContent = "";
}

function isGameOver() {
  const unFlipped = document.querySelectorAll(".unflipped");
  if(unFlipped.length === 0) {
    totalShadow.style.display = "none";
    winScreen.style.display = "flex";
    updateBestScore();
    updateBestTime();
    clearInterval(checkGameOver);
    clearInterval(timer);
  }
}

function restartGame() {
  deleteCards();
  createCards(shuffle(COLORS));
  totalShadow.style.display = "block";
  winScreen.style.display = "none";
  num = 0;
  totalSeconds = 0;
  updateScore();
  checkGameOver = window.setInterval(isGameOver, FOUND_MATCH_WAIT_MSECS);
  timer = window.setInterval(countTimer, FOUND_MATCH_WAIT_MSECS);
}

function returnToStart() {
  deleteCards();
  COLORS = [];
  COLORSCOPY = [];
  num = 0;
  totalSeconds = 0;
  updateScore();
  winScreen.style.display = "none";
  startGameWindow.style.display = "flex";
}

function deleteCards() {
  const cards = document.querySelectorAll(".card");
  for(let card of cards) {
    card.remove();
  }
}

function countTimer() {
  ++totalSeconds;
  let minute = Math.floor((totalSeconds) / 60);
  let seconds = totalSeconds - (minute * 60);
  for(let time of gameTimer) {
    timeTextContent = time.textContent;
    time.textContent = (minute >= 10 ? minute : "0" + minute) + ":" + (seconds >= 10 ? seconds : "0" + seconds);
  }
}
