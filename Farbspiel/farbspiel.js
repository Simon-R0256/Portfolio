//Declare Global Variables
var colorArray = [];
var waitUserInput = false;

const actionLabel = document.getElementById("actionLabel");
const levelLabel = document.getElementById("farbLvl");

const feedbackBox = document.getElementById("feedbackBox");
const feedbackText= document.getElementById("feedbackText");


//Startbutton
document.getElementById("colorGameStart").addEventListener("click", () => {
    if(!waitUserInput){
        colorArray = getColorArray();
        showColorArray(colorArray);
        actionLabel.innerHTML = "Warte auf Input...";
        feedbackBox.style.backgroundColor = "transparent";
        feedbackText.innerHTML = "";
    }
})

function chooseColor(color){
    const expectedColor = colorArray.shift();
    if(expectedColor == color){
        feedbackBox.style.backgroundColor = expectedColor;
        feedbackText.innerHTML = 'Richtig <i class="bi bi-check-lg">'
        if(colorArray.length == 0){
            waitUserInput = false;
            actionLabel.innerHTML = "Drücke auf Start!"
            levelLabel.innerHTML++;
        }
    }
    else{
        feedbackBox.style.backgroundColor = expectedColor;
        feedbackText.innerHTML = 'Falsch <i class="bi bi-x-lg">'
        colorArray = [];
        waitUserInput = false;
        actionLabel.innerHTML = "Drücke auf Start!"
        if(levelLabel.innerHTML > 1){
            levelLabel.innerHTML--;
        } 
    }
}

function showColorArray(arr) {
    const farbFeld = document.getElementById("farbAnzeige");
    for(let i = 0;i<=arr.length;i++){
        setTimeout( () => {
            if(i == arr.length){
                farbFeld.style.backgroundColor = "white";
                waitUserInput = true;
            }
            else{
                farbFeld.style.backgroundColor = arr[i];
            }
        }, i * 1600);
    }
}

function getColorArray(){
    const lvl = Number.parseInt(levelLabel.innerHTML);
    const arr = [];
    for(let i = 0; i<lvl+2; i++){
        let color = getRandomColor()
        while(i > 0 && color == arr[i-1]){
            color = getRandomColor();
        }
        arr.push(color);
    }
    return arr;
}

function getRandomColor(){
    const number = Math.random();

    if(number > 0.75){
        return "green";
    }
    else if(number > 0.5){
        return "blue";
    }
    else if(number > 0.25){
        return "red";
    }
    else {
        return "yellow";
    }
}

//Actionlistener der Buttons
document.getElementById("green").addEventListener("click", () => {
    if(waitUserInput){
        chooseColor("green"); 
    }
})

document.getElementById("blue").addEventListener("click", () => {
    if(waitUserInput){
        chooseColor("blue"); 
    }
})

document.getElementById("red").addEventListener("click", () => {
    if(waitUserInput){
        chooseColor("red"); 
    }
})

document.getElementById("yellow").addEventListener("click", () => {
    if(waitUserInput){
        chooseColor("yellow"); 
    }
})

