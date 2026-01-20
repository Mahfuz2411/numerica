const digitBoxes = document.querySelectorAll(".digitBox");

const textBoard = document.getElementById("textBoard");
const scoreBoard = document.getElementById("scoreBoard");

const gb01 = document.getElementById("gb01");
const gb02 = document.getElementById("gb02");
const gb03 = document.getElementById("gb03");

const ruleBook = document.getElementById("ruleBook");
const memory = document.getElementById("memory");

const submitBtn = document.getElementById("submitBtn");

const alert = document.getElementById("alert");

// Audio context for playing sounds
let audioContext = null;

// Initialize audio context on first user interaction
function initAudioContext() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
}

// Play sound function
const playSound = (soundType) => {
  initAudioContext();
  
  if (!audioContext) return;

  let frequency = 0;
  let duration = 0;
  let notes = [];

  if (soundType === 'correct') {
    // Success beep - rising tones
    notes = [
      { freq: 523, start: 0, duration: 0.15 },
      { freq: 659, start: 0.2, duration: 0.15 }
    ];
    duration = 0.35;
  } else if (soundType === 'incorrect') {
    // Error buzz - falling tones
    notes = [
      { freq: 400, start: 0, duration: 0.15 },
      { freq: 300, start: 0.2, duration: 0.15 }
    ];
    duration = 0.35;
  } else if (soundType === 'win') {
    // Victory fanfare - rising melody
    notes = [
      { freq: 523, start: 0, duration: 0.15 },
      { freq: 659, start: 0.2, duration: 0.15 },
      { freq: 784, start: 0.4, duration: 0.15 },
      { freq: 988, start: 0.6, duration: 0.4 }
    ];
    duration = 1;
  } else if (soundType === 'lose') {
    // Sad trombone - falling melody
    notes = [
      { freq: 400, start: 0, duration: 0.2 },
      { freq: 300, start: 0.25, duration: 0.2 },
      { freq: 200, start: 0.5, duration: 0.3 }
    ];
    duration = 0.8;
  }

  const now = audioContext.currentTime;

  notes.forEach(note => {
    const osc = audioContext.createOscillator();
    const gain = audioContext.createGain();

    osc.frequency.value = note.freq;
    osc.connect(gain);
    gain.connect(audioContext.destination);

    const startTime = now + note.start;
    gain.gain.setValueAtTime(0.2, startTime);
    gain.gain.exponentialRampToValueAtTime(0.01, startTime + note.duration);

    osc.start(startTime);
    osc.stop(startTime + note.duration);
  });
};

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
      gb01.dispatchEvent(new Event("submit"));
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
const maxGuesses = 30;




const handleSubmit = () => {
  let inputText = "";
  
  // Collect all digit values
  digitBoxes.forEach(box => {
    inputText += box.value;
  });

  if (!inputText || inputText.length === 0) {
    showAlert("No Input Found!", "error");
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

    gb03.innerText = `Total Guess: ${totalGuess}`;
    if (correct == 5) {
      playSound('win');
      submitBtn.innerText = "Reset";
      updateScoresInDB(totalGuess);

      Swal.fire({
        title: `${getRank(totalGuess).icon}  ${getRank(totalGuess).name}  ${getRank(totalGuess).icon}`,
        text: `You guessed the Number in ${totalGuess} moves`,
        icon: "success",
        footer: `<strong>Rank Title:</strong> ${getRank(totalGuess).title}`,
      });

      gameOver = true;

    } else if (totalGuess >= maxGuesses) {
      playSound('lose');
      showAlert(`Game Over! You've reached the limit of ${maxGuesses} guesses`, "error");
      gameOver = true;
      submitBtn.innerText = "Reset";
      Swal.fire({
        title: "☠️ GAME OVER ☠️",
        text: `You couldn't guess the number within ${maxGuesses} attempts.\nThe number was: ${randomNumber}`,
        icon: "error",
        footer: "Click Reset to try again!",
      });
    } else {
      if (correct > 0) {
        playSound('correct');
      } else {
        playSound('incorrect');
      }

      const guess = document.createElement("div");
      guess.classList.add("guess");

      if (correct == 0) guess.classList.add("incorrect");
      else guess.classList.add("success");

      guess.innerText = `${inputText}: ${correct} in correct position`;
      gb02.appendChild(guess);
      
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
  gb03.innerText = `Total Guess: 0`;

  // Clear all digit boxes
  digitBoxes.forEach(box => {
    box.value = "";
  });
  digitBoxes[0].focus();
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
    if (!scoreBoard.classList.contains("hidden")) {
      scoreBoard.classList.toggle("hidden");
    }
    showAlert("RuleBook opened", "info", 3000);
  } else {
    showAlert("RuleBook closed", "info", 3000);
  }
});

memory.addEventListener("click", () => {


  scoreBoard.classList.toggle("hidden");
  if (!scoreBoard.classList.contains("hidden")) {
    if (!textBoard.classList.contains("hidden")) {
      textBoard.classList.toggle("hidden");
    }
    updateScoreBoard();
    showAlert("Score Board opened", "info", 3000);
  } else {
    showAlert("Score Board closed", "info", 3000);
  }
});