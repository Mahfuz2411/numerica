const digitBoxes = document.querySelectorAll(".digitBox");

const rulesPanel = document.getElementById("rulesPanel");
const leaderboardPanel = document.getElementById("leaderboardPanel");


const guessForm = document.getElementById("guessForm");
const guessHistory = document.getElementById("guessHistory");
const guessCounter = document.getElementById("guessCounter");

const rulesBtn = document.getElementById("rulesBtn");
const topScoresBtn = document.getElementById("topScoresBtn");

const submitBtn = document.getElementById("submitBtn");

const alertBox = document.getElementById("alert");

// Setup digit input handlers
digitBoxes.forEach((box, index) => {
  box.addEventListener("input", (e) => {
    // Only allow digits
    e.target.value = e.target.value.replace(/[^0-9]/g, "");
    
    // Move to next box if digit entered
    if (e.target.value.length === 1 && index < digitBoxes.length - 1) {
      digitBoxes[index + 1].focus();
    }
  });

  box.addEventListener("keydown", (e) => {
    // Backspace - move to previous box
    if (e.key === "Backspace" && e.target.value === "" && index > 0) {
      digitBoxes[index - 1].focus();
    }
    
    // Enter key - submit form
    if (e.key === "Enter") {
      e.preventDefault();
      guessForm.dispatchEvent(new Event("submit"));
    }
  });
});




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

  if (data.best === null || move < data.best) {
    data.good = data.better;
    data.better = data.best;
    data.best = move;
    changed = true;
  }
  else if (data.better === null || move < data.better) {
    data.good = data.better;
    data.better = move;
    changed = true;
  }
  else if (data.good === null || move < data.good) {
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
  document.getElementById("bestScore").innerText = `Best: ${data.best === null ? "N/A" : data.best}`;
  document.getElementById("betterScore").innerText = `Better: ${data.better === null ? "N/A" : data.better}`;
  document.getElementById("goodScore").innerText = `Good: ${data.good === null ? "N/A" : data.good}`;
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
  alertBox.textContent = mssg;
  alertBox.className = type;

  setTimeout(() => {
    alertBox.className = "hidden";
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
const maxGuesses = 50;




const handleSubmit = () => {
  let inputText = "";
  
  // Collect all digit values
  digitBoxes.forEach(box => {
    inputText += box.value;
  });

  if (!inputText || inputText.length === 0) {
    showAlert("No Input Found!", "error");
  } else if (totalGuess >= maxGuesses) {
    showAlert(`Game Over! You've reached the limit of ${maxGuesses} guesses`, "error");
    gameOver = true;
    submitBtn.innerText = "Reset";
    Swal.fire({
      title: "☠️ GAME OVER ☠️",
      text: `You couldn't guess the number within ${maxGuesses} attempts.\nThe number was: ${randomNumber}`,
      icon: "error",
      footer: "Click Reset to try again!",
    });
  } else if (inputText.length != 5) {
    showAlert("Please fill all 5 digits!", "error");
  } else if (/[^0-9]/.test(inputText)) {
    showAlert("Only digits 0-9 allowed!", "error");
  } else {
    let correct = 0;
    totalGuess++;

    for (let i = 0; i < 5; i++) {
      if (inputText[i] == randomNumber[i]) correct++;
    }

    guessCounter.innerText = `Total Guess: ${totalGuess}`;
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
      guessHistory.appendChild(guess);
      
      // Clear all digit boxes
      digitBoxes.forEach(box => {
        box.value = "";
      });
      digitBoxes[0].focus();
    }
  }
};

const handleReset = () => {
  randomNumber = randomNumberMaker();
  totalGuess = 0;
  gameOver = false;
  submitBtn.innerText = "Submit";
  guessCounter.innerText = `Total Guess: 0`;

  // Clear all digit boxes
  digitBoxes.forEach(box => {
    box.value = "";
  });
  digitBoxes[0].focus();
  guessHistory.innerHTML = "";

}

guessForm.addEventListener("submit", (e) => {
  e.preventDefault();
  if (!gameOver) {
    handleSubmit();
  } else {
    handleReset();
  }
});

rulesBtn.addEventListener("click", () => {

  rulesPanel.classList.toggle("hidden");

  if (!rulesPanel.classList.contains("hidden")) {
    if (!leaderboardPanel.classList.contains("hidden")) {
      leaderboardPanel.classList.toggle("hidden");
    }
    showAlert("RuleBook opened", "info", 3000);
  } else {
    showAlert("RuleBook closed", "info", 3000);
  }
});

topScoresBtn.addEventListener("click", () => {


  leaderboardPanel.classList.toggle("hidden");
  if (!leaderboardPanel.classList.contains("hidden")) {
    if (!rulesPanel.classList.contains("hidden")) {
      rulesPanel.classList.toggle("hidden");
    }
    updateScoreBoard();
    showAlert("Score Board opened", "info", 3000);
  } else {
    showAlert("Score Board closed", "info", 3000);
  }
});