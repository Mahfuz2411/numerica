console.log("HEllo");

const input = document.getElementById("input");

const textBoard = document.getElementById("textBoard");
const scoreBoard = document.getElementById("scoreBoard");


const gb01 = document.getElementById("gb01");
const gb02 = document.getElementById("gb02");
const gb03 = document.getElementById("gb03");

const ruleBook = document.getElementById("ruleBook");
const memory = document.getElementById("memory");

const submitBtn = document.getElementById("submitBtn");

const alert = document.getElementById("alert");




// -------------
// Main Code
// -------------
// let randomNumber = Math.floor(Math.random()*90000 + 10000);
// Global DB reference
let db;

// One fixed record for scores
const data = {
  id: 1,
  best: null,
  better: null,
  good: null
};

// Open (or create) database
const request = indexedDB.open("guessTheNumberDB", 1);

// Create object store (runs only once)
request.onupgradeneeded = (e) => {
  const db = e.target.result;
  const store = db.createObjectStore("scores", { keyPath: "id" });

  // Initial record
  store.add(data);
};

// DB opened successfully
request.onsuccess = (e) => {
  db = e.target.result;
  loadScoresFromDB();
};

request.onerror = () => {
  console.error("Error opening database");
};

// Load scores from IndexedDB
function loadScoresFromDB() {
  const transaction = db.transaction("scores", "readonly");
  const store = transaction.objectStore("scores");
  const getRequest = store.get(1);

  getRequest.onsuccess = (e) => {
    const record = e.target.result;
    if (!record) return;

    data.best = record.best;
    data.better = record.better;
    data.good = record.good;

    console.log("Scores loaded:", data);
  };
}

// Update scores logic
function updateScoresInDB(move) {
  let changed = false;

  if (data.best === null || move > data.best) {
    data.good = data.better;
    data.better = data.best;
    data.best = move;
    changed = true;
  }
  else if (data.better === null || move > data.better) {
    data.good = data.better;
    data.better = move;
    changed = true;
  }
  else if (data.good === null || move > data.good) {
    data.good = move;
    changed = true;
  }

  if (!changed) return;

  const transaction = db.transaction("scores", "readwrite");
  const store = transaction.objectStore("scores");

  store.put({
    id: 1,
    best: data.best,
    better: data.better,
    good: data.good
  });

  updateScoreBoard();

  transaction.oncomplete = () => {
    console.log("Scores updated:", data);
  };

  transaction.onerror = () => {
    console.error("Failed to update scores");
  };
}


const updateScoreBoard = () => {
  document.getElementById("best").innerText = `Best: ${data.best === null ? "N/A" : data.best}`;
  document.getElementById("better").innerText = `Better: ${data.better === null ? "N/A" : data.better}`;
  document.getElementById("good").innerText = `Good: ${data.good === null ? "N/A" : data.good}`;
}


function getRank(moves) {
  if (moves <= 5)
    return { name: "HACKER", title: "Totally Unfair", icon: "😈" };

  if (moves <= 8)
    return { name: "LEGEND", title: "Elite Brain", icon: "👑" };

  if (moves <= 11)
    return { name: "MASTER", title: "Mind Reader", icon: "🧠" };

  if (moves <= 14)
    return { name: "PRO", title: "Tactical Player", icon: "🎯" };

  if (moves <= 17)
    return { name: "SKILLED", title: "Getting Better", icon: "⚡" };

  if (moves <= 20)
    return { name: "BEGINNER", title: "Learning Mode", icon: "🐣" };

  return { name: "NOOB", title: "Try Again", icon: "☠️" };
}


const showAlert = (mssg, type, time = 3000) => {
  alert.textContent = mssg;
  alert.className = type;

  setTimeout(() => {
    alert.className = "hidden";
  }, time);
}

const randomNumberMaker = () => {
  let result = "";
  for (let i = 0; i < 5; i++) {
    result += Math.floor(Math.random() * 10);
  }
  // showAlert(``, "info")
  return result;
}

let randomNumber = randomNumberMaker();
let totalGuess = 0;
let gameOver = false;

console.log(randomNumber);




const handleSubmit = () => {
  let inputText = input.value;
  if (!inputText) {
    showAlert("No Input Found!", "error");
  } else if (inputText.length != 5) {
    if (inputText.length < 5) {
      showAlert(`Add ${5 - inputText.length} more digit`, "error");
    } else {
      showAlert(`Remove ${inputText.length - 5} digit/s`, "error");
    }

  } else {
    let correct = 0;
    totalGuess++;

    for (let i = 0; i < 5; i++) {
      if (inputText[i] == randomNumber[i]) correct++;
    }

    gb03.innerText = `Total Guess: ${totalGuess}`;
    if (correct == 5) {
      submitBtn.innerText = "Reset";
      updateScoresInDB(totalGuess);

      // showAlert(`You guessed the Number in ${totalGuess} moves`, "success", 10000);
      Swal.fire({
        title: `${getRank(totalGuess).icon}  ${getRank(totalGuess).name}  ${getRank(totalGuess).icon}`,
        text: `You guessed the Number in ${totalGuess} moves`,
        icon: "success",
        footer: `<strong>Rank Title:</strong> ${getRank(totalGuess).title}`,
      });

      gameOver = true;

    } else {
      const guess = document.createElement("div");
      guess.classList.add("guess");

      if (correct == 0) guess.classList.add("incorrect");
      else guess.classList.add("success");

      guess.innerText = `${inputText}: ${correct} in correct position`;
      gb02.appendChild(guess);
      input.value = "";
    }
  }
};

const handleReset = () => {
  randomNumber = randomNumberMaker();
  totalGuess = 0;
  gameOver = false;
  submitBtn.innerText = "Submit";

  input.value = "";
  gb02.innerHTML = "";

}

gb01.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!gameOver) {
    handleSubmit();
  } else {
    handleReset();
  }
});

ruleBook.addEventListener("click", () => {
  textBoard.classList.toggle("hidden");

  if (!textBoard.classList.contains("hidden")) {
    showAlert("RuleBook opened", "info");
  } else {
    showAlert("RuleBook closed", "info");
  }
});

memory.addEventListener("click", () => {
  scoreBoard.classList.toggle("hidden");
  if (!scoreBoard.classList.contains("hidden")) {
    updateScoreBoard();
    showAlert("Score Board opened", "info");
  } else {
    showAlert("Score Board closed", "info");
  }
});