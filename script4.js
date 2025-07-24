const countries = [
  { name: "Australia", image: "images/australia.png" },
  { name: "Austria", image: "images/austria.png" },
  { name: "Brazil", image: "images/brazil.png" },
  { name: "Canada", image: "images/canada.png" },
  { name: "Chile", image: "images/chile.png" },
  { name: "China", image: "images/china.png" },
  { name: "Congo", image: "images/congo.png" },
  { name: "Costa Rica", image: "images/costa_rica.png" },
  { name: "Croatia", image: "images/croatia.png" },
  { name: "Cuba", image: "images/cuba.png" },
  { name: "Cyprus", image: "images/cyprus.png" },
  { name: "Denmark", image: "images/denmark.png" },
  { name: "Egypt", image: "images/egypt.png" },
  { name: "Finland", image: "images/finland.png" },
  { name: "France", image: "images/france.png" },
  { name: "Georgia", image: "images/georgia.png" },
  { name: "Germany", image: "images/germany.png" },
  { name: "Greece", image: "images/greece.png" },
  { name: "Hungary", image: "images/hungary.png" },
  { name: "Iceland", image: "images/iceland.png" },
  { name: "India", image: "images/india.png" },
  { name: "Ireland", image: "images/ireland.png" },
  { name: "Italy", image: "images/italy.png" },
  { name: "Japan", image: "images/japan.png" },
  { name: "Liechtenstein", image: "images/liechtenstein.png" },
  { name: "Lithuania", image: "images/lithuania.png" },
  { name: "Luxembourg", image: "images/luxembourg.png" },
  { name: "Mexico", image: "images/mexico.png" },
  { name: "Monaco", image: "images/monaco.png" },
  { name: "Morocco", image: "images/morocco.png" },
  { name: "Mozambique", image: "images/mozambique.png" },
  { name: "Namibia", image: "images/namibia.png" },
  { name: "Netherlands", image: "images/netherlands.png" },
  { name: "New Zealand", image: "images/new_zealand.png" },
  { name: "Nigeria", image: "images/nigeria.png" },
  { name: "Poland", image: "images/poland.png" },
  { name: "Qatar", image: "images/qatar.png" },
  { name: "Romania", image: "images/romania.png" },
  { name: "Russia", image: "images/russia.png" },
  { name: "Rwanda", image: "images/rwanda.png" },
  { name: "Samoa", image: "images/samoa.png" },
  { name: "Senegal", image: "images/senegal.png" },
  { name: "South Africa", image: "images/south_africa.png" },
  { name: "Spain", image: "images/spain.png" },
  { name: "Switzerland", image: "images/switzerland.png" },
  { name: "Tunisia", image: "images/tunisia.png" },
  { name: "Uruguay", image: "images/uruguay.png" },
  { name: "Vatican City", image: "images/vatican_city.png" }
];

let score = 0;
let usedCountries = [];
let timeLeft = 30;
let timerInterval;
let playerName = "";

const timerEl = document.getElementById("timer");
const scoreEl = document.getElementById("score");
const imageEl = document.getElementById("country-image");
const optionButtons = document.querySelectorAll(".option-btn");
const gameOverEl = document.getElementById("game-over");
const finalScoreEl = document.getElementById("final-score");
const playerNameInput = document.getElementById("player-name");

document.getElementById("start-btn").addEventListener("click", startGame);
document.getElementById("play-again-btn").addEventListener("click", startGame);
document.getElementById("reset-leaderboard-btn").addEventListener("click", function () {
  if (confirm("Are you sure you want to reset the leaderboard?")) {
    localStorage.removeItem("leaderboard");
    renderLeaderboard();
  }
});

function startGame(event) {
  document.getElementById("country-image").style.display = "block";
  const isPlayAgain = event.target.id === "play-again-btn";

  if (!isPlayAgain || !playerName) {
    const inputName = playerNameInput.value.trim();
    if (!inputName) {
      alert("Please enter your name to start the game.");
      return;
    }
    playerName = inputName;
  }

  score = 0;
  usedCountries = [];
  timeLeft = 30;
  gameOverEl.classList.add("hidden");
  scoreEl.textContent = "Score: 0";
  timerEl.textContent = `⏱️ ${timeLeft}`;
  optionButtons.forEach(btn => {
  btn.disabled = false;
  btn.classList.remove("red");
  btn.onclick = null; // Clear any previous handlers
});
  startTimer();
  nextQuestion();
}

function startTimer() {
  clearInterval(timerInterval);
  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ ${timeLeft}`;

    // 🔔 Add visual warning when time is low
    if (timeLeft <= 5) {
      timerEl.classList.add("warning");
    } else {
      timerEl.classList.remove("warning");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

const progressBar = document.getElementById("progress-bar");

function startTimer() {
  clearInterval(timerInterval);
  progressBar.style.width = "100%"; // Reset bar

  timerInterval = setInterval(() => {
    timeLeft--;
    timerEl.textContent = `⏱️ ${timeLeft}`;
    progressBar.style.width = `${(timeLeft / 30) * 100}%`;

    if (timeLeft <= 5) {
      timerEl.classList.add("warning");
      progressBar.style.backgroundColor = "#f44336"; // red
    } else {
      timerEl.classList.remove("warning");
      progressBar.style.backgroundColor = "#4caf50"; // green
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame();
    }
  }, 1000);
}

function nextQuestion() {
  const remainingCountries = countries.filter(c => !usedCountries.includes(c.name));
  if (remainingCountries.length === 0) {
    endGame();
    return;
  }

  const correct = remainingCountries[Math.floor(Math.random() * remainingCountries.length)];
  usedCountries.push(correct.name);
  imageEl.src = correct.image;

  const options = [correct.name];
  while (options.length < 4) {
    const random = countries[Math.floor(Math.random() * countries.length)].name;
    if (!options.includes(random)) options.push(random);
  }

  shuffleArray(options);
  optionButtons.forEach((btn, i) => {
    btn.textContent = options[i];
    btn.onclick = () => {
      if (btn.textContent === correct.name) {
        score++;
        scoreEl.textContent = `Score: ${score}`;
      }
      nextQuestion();
    };
  });
}

function endGame() {
  finalScoreEl.textContent = score;
  gameOverEl.classList.remove("hidden");
  optionButtons.forEach(btn => {
  btn.disabled = true;
  btn.classList.add("red"); // Add red style
  });
  updateLeaderboard(playerName, score);
}

function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function updateLeaderboard(name, score) {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  leaderboard.push({ name, score });
  leaderboard.sort((a, b) => b.score - a.score);
  if (leaderboard.length > 10) leaderboard.length = 10;
  localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  renderLeaderboard();
}

function renderLeaderboard() {
  const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
  const list = document.getElementById("leaderboard-list");
  list.innerHTML = "";
  leaderboard.forEach((entry, index) => {
    const li = document.createElement("li");
    li.textContent = `#${index + 1}: ${entry.name} - ${entry.score} points`;
    list.appendChild(li);
  });
}
