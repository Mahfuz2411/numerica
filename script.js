console.log("HEllo");

let input = document.getElementById("input");


let gb01 = document.getElementById("gb01");
let gb02 = document.getElementById("gb02");
let gb03 = document.getElementById("gb03");
let gb04 = document.getElementById("gb04");

let submitBtn = document.getElementById("submitBtn");

let alert = document.getElementById("alert");

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


// -------------
// Main Code
// -------------
// let randomNumber = Math.floor(Math.random()*90000 + 10000);

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

// console.log(randomNumber);




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

      // showAlert(`You guessed the Number in ${totalGuess} moves`, "success", 10000);
      Swal.fire({
        title: `${ getRank(totalGuess).icon }  ${getRank(totalGuess).name}  ${getRank(totalGuess).icon }`,
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

gb04.addEventListener("click", () => {
  const textBoard = document.getElementById("textBoard");
  textBoard.classList.toggle("hidden");

  if (!textBoard.classList.contains("hidden")) {
    showAlert("RuleBook opened", "info");
    gb04.innerText = "📘";
  } else {
    showAlert("RuleBook closed", "info");
    gb04.innerText = "📖";
  }
});