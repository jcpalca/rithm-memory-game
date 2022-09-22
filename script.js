"use strict";

/** Memory game: find matching pairs of cards and flip both of them. */

const gameBoard = document.getElementById("game");
const FOUND_MATCH_WAIT_MSECS = 1000;
const COLORS = [
  "red", "blue", "green", "orange", "purple", "yellow",
  "red", "blue", "green", "orange", "purple", "yellow",
];
let firstFlip = false;
let firstCard;
let secondCard;
let pauseGame = false;

const colors = shuffle(COLORS);

createCards(colors);


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
  for (let color of colors) {
    // missing code here ...
    let card = document.createElement("div");
    card.classList.add(color, "card", "unflipped");
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
