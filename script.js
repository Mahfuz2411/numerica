console.log("HEllo");

let input = document.getElementById("input");

let gb01 = document.getElementById("gb01");

let submitBtn = document.getElementById("submitBtn");


let resetBtn = document.getElementById("resetBtn");

let alert = document.getElementById("alert");


// -------------
// Main Code
// -------------
// let randomNumber = Math.floor(Math.random()*90000 + 10000);

const randomNumberMaker = () => {
    let result = "";
    for (let i=0; i<5; i++) {
        result += Math.floor(Math.random()*10);
    }
    return result;
}

const showAlert = (mssg, type) => {
    alert.textContent = mssg;
    alert.className = type;

    setTimeout(() => {
        alert.className = "hidden"; 
    }, 3000);
}

let randomNumber = randomNumberMaker();
let totalGuess = 0;


submitBtn.addEventListener("click", () => {
    let inputText = input.value;
    if(!inputText ) {
        showAlert("No Input Found!", "error");
    } else if(inputText.length != 5) {
        if(inputText.length < 5) {
            showAlert(`Add ${5 - inputText.length} more digit`, "error");
        } else {
            showAlert(`Remove ${inputText.length - 5} digit/s`, "error");
        }
        
    } else {
        let correct = 0;
        totalGuess ++;

        for(let i=0; i<5; i++) {
            if(inputText[i] == randomNumber[i]) correct++;
        }

        if(correct == 5) {
            gb01.innerText = "You guessed it!!"

            showAlert(`You guessed the Number in ${totalGuess} moves`, "success");

            submitBtn.className = "hidden";
            resetBtn.className = "";
        } else {
            gb01.innerText = `${correct} in correct position`;
        }
        
    }

});

resetBtn.addEventListener("click", () => {
    randomNumber = randomNumberMaker();
    totalGuess = 0;

    submitBtn.className = "";
    resetBtn.className = "hidden";
});
