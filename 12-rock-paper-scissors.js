// In order to be able to use the score that is saved in local storage, we need to change it back to a JS object with this function
let score = JSON.parse(localStorage.getItem("score")) || {
  wins: 0,
  losses: 0,
  tie: 0,
};

// Display score in document after refreshing page and checking localStorage
updateScore();

let isAutoPlaying = false;
let intervalId;

const resetBtn = document.querySelector(".js-reset-button");
const autoPlayBtn = document.querySelector(".js-auto-play-button");

//Move Randomizer
function pickCompMove() {
  randomNumber = Math.random();
  let compMove = "";

  if (randomNumber >= 0 && randomNumber < 1 / 3) {
    compMove = "rock";
  } else if (randomNumber >= 1 / 3 && randomNumber < 2 / 3) {
    compMove = "paper";
  } else if (randomNumber >= 2 / 3 && randomNumber < 1) {
    compMove = "scissors";
  }
  return compMove;
}

function showConfirmation() {
  document.querySelector(".confirmation-text").innerHTML = `
<div class="confirmation-message">
  <p>Are you sure you want to reset the score?</p>
  <button class="js-yes-button">Yes</button>
  <button class="js-no-button">No</button>
</div>`;

  document.querySelector(".js-yes-button").addEventListener("click", () => {
    reset("yes");
  });
  document.querySelector(".js-no-button").addEventListener("click", () => {
    hideConfirmation();
  });
}

resetBtn.addEventListener("click", () => {
  showConfirmation();
});

function hideConfirmation() {
  document.querySelector(".confirmation-message").innerHTML = "";
}

function reset(answer) {
  if (answer === "yes") {
    score.wins = 0;
    score.losses = 0;
    score.tie = 0;

    localStorage.removeItem("score");
    updateScore();
    hideConfirmation();
  }
}

autoPlayBtn.addEventListener("click", () => {
  autoPlay();
});

function autoPlay() {
  if (!isAutoPlaying) {
    intervalId = setInterval(() => {
      const playerMove = pickCompMove();
      playGame(playerMove);
    }, 1000);
    isAutoPlaying = true;
    autoPlayBtn.innerHTML = "Stop Playing";
  } else {
    clearInterval(intervalId);
    isAutoPlaying = false;
    autoPlayBtn.innerHTML = "Autoplay";
  }
}

// Getting the HTML elements through JavaScript
document.querySelector(".js-rock").addEventListener("click", () => {
  playGame("rock");
});
document.querySelector(".js-paper").addEventListener("click", () => {
  playGame("paper");
});
document.querySelector(".js-scissors").addEventListener("click", () => {
  playGame("scissors");
});

// PLAY WITH KEYBOARD
document.body.addEventListener("keydown", (event) => {
  if (event.key === "r") {
    playGame("rock");
  } else if (event.key === "p") {
    playGame("paper");
  } else if (event.key === "s") {
    playGame("scissors");
  } else if (event.key === "a") {
    autoPlay();
  } else if (event.key === "Backspace") {
    showConfirmation();
  }
});

// GAME INSTRUCTIONS (FT. Move Randomizer)
function playGame(playerMove) {
  const compMove = pickCompMove();

  let result = "";

  // Checking player move vs computer move & determining whether it's Win/Lose/Tie
  if (playerMove === "scissors") {
    if (compMove === "rock") {
      result = "You Lose!";
    } else if (compMove === "paper") {
      result = "You Win!";
    } else if (compMove === "scissors") {
      result = "Tie.";
    }
  } else if (playerMove === "paper") {
    result = "";

    if (compMove === "rock") {
      result = "You Win!";
    } else if (compMove === "paper") {
      result = "Tie.";
    } else if (compMove === "scissors") {
      result = "You Lose!";
    }
  } else if (playerMove === "rock") {
    result = "";

    if (compMove === "rock") {
      result = "Tie.";
    } else if (compMove === "paper") {
      result = "You Lose!";
    } else if (compMove === "scissors") {
      result = "You Win!";
    }
  }

  // Depending on result (Win/Lose/Tie), this will increase score by 1 in appropriate result
  if (result === "You Win!") {
    score.wins++;
  } else if (result === "You Lose!") {
    score.losses++;
  } else if (result === "Tie.") {
    score.tie++;
  }

  // Local storage only accepts strings so we have to convert JS object into JSON.
  // Saving "score" in localStorage
  localStorage.setItem("score", JSON.stringify(score));

  // Updating score!!!
  updateScore();

  // What moves were made in that round
  document.querySelector(".js-result").innerHTML = result;

  document.querySelector(".js-moves").innerHTML = `You
<img src="images/${playerMove}-emoji.png" class="move-icon" alt="" />
<img src="images/${compMove}-emoji.png" class="move-icon" alt="" />
Computer`;
}

// Display score in document
function updateScore() {
  document.querySelector(".js-score").innerHTML = `
    Wins: ${score.wins}  ||  Losses: ${score.losses}  ||  Ties: ${score.tie}`;
}
