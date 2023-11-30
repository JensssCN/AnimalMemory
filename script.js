const pictures = [
    { animal: 'dog', image: 'dog1.jpg' },
    { animal: 'cat', image: 'cat1.jpg' },
    { animal: 'fish', image: 'fish1.jpg' },
    { animal: 'fox', image: 'fox1.jpg' },
    { animal: 'guineapig', image: 'guineapig1.jpg' },
    { animal: 'horse', image: 'horse1.jpg' },
    { animal: 'lion', image: 'lion1.jpg' },
    { animal: 'panda', image: 'panda1.jpg' },
    { animal: 'gorilla', image: 'harambe1.jpg' },
    { animal: 'goat', image: 'goat1.jpg' },
    { animal: 'turtle', image: 'turtle1.jpg' },
    { animal: 'zebra', image: 'zebra1.jpg' },
];

//variablerna för start-game-container
const startGameContainer = document.querySelector('.start-game-container');
const inputPlayerOne = document.querySelector('#player-1');
const inputPlayerTwo = document.querySelector('#player-2');
const startBtn = document.querySelector('.start-game-btn');
const resetBtn = document.querySelector('.reset-game-btn');

//variablerna för game-container
const gameContainer = document.querySelector('.game-container');
const cardContainer = document.querySelector('.card-container');
const scoreboard = document.querySelector('.scoreboard');
const playerOneName = document.querySelector('.player-one-name');
const playerTwoName = document.querySelector('.player-two-name');
const currentPlayer = document.querySelector('.current-player');

//Variabler för winner-container
const winnerContainer = document.querySelector('.winner-container');
const winnerMessage = document.querySelector('.winner-message');
const restartGameBtn = document.querySelector('.restart-game-btn');

function updateDisplay() {
    currentPlayer.innerText = players[gameTurn].name + "s tur";
    playerOneName.innerText = players[0].name + " poäng: " + players[0].score;
    playerTwoName.innerText = players[1].name + " poäng: " + players[1].score;
}

let gameTurn = 0;
let players = [];

// startar spelet
startBtn.addEventListener('click', startGame);

// det man skriver på "input" blir spelarens namn.
function startGame() {

    gameTurn = 0;
    let playerOne = {
        name: inputPlayerOne.value,
        score: 0,
    };
    let playerTwo = {
        name: inputPlayerTwo.value,
        score: 0,
    };

    if (inputPlayerOne.value == '') {
        playerOne.name = 'Player 1';
    }
    if (inputPlayerTwo.value == '') {
        playerTwo.name = 'Player 2';
    }

    players = [playerOne, playerTwo]

    cardContainer.style.display = 'flex'
    updateDisplay();
    startGameContainer.style.display = 'none';
    gameContainer.style.display = 'flex';
    shuffleAnimalArray();
}

//startGame(); //Två slash på denna för att komma till start menyn (bara för test)

function shuffleAnimalArray() {
    let randomArray = [];
    for (let i = 0; i < pictures.length; i++) {
        for (let j = 0; j < 2; j++) { //Denna loop lägger till 2 av varje bild.
            randomArray.push(pictures[i].animal)
        }
    }
    randomArray.sort(() => Math.random() - 0.5); // Detta gör så att korten blir blandade i spelet.

    cardGenerator(randomArray);
};

function cardGenerator(arr) {
    for (let i = 0; i < arr.length; i++) {
        let card = document.createElement('article');
        let cardFront = document.createElement('div');
        let cardBack = document.createElement('div');

        card.classList.add('card');
        cardFront.classList.add('card-front');
        cardBack.classList.add('card-back');
        cardBack.style.backgroundImage = `url(${pictures.find(e => e.animal === arr[i]).image})`;
        cardContainer.append(card);
        
        card.append(cardFront, cardBack);
    }

    let cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', flipCards);
    });
}

let cardOne;
let cardTwo;

function flipCards(event) {
    let clickedCard = event.target;
    let cardParent = clickedCard.parentElement;
    let clickedCardBack = cardParent.querySelector('.card-back')
    if (clickedCardBack != cardOne) {

        clickedCard.parentElement.classList.add('card-flip');
        if (!cardOne) {
            return cardOne = clickedCardBack;
        }

        cardTwo = clickedCardBack;
        matchCards(cardOne, cardTwo);
    }
}

function matchCards(picture1, picture2) {
    const animal1 = getAnimalType(picture1);
    const animal2 = getAnimalType(picture2);

    if (animal1 === animal2) {
        players[gameTurn].score = players[gameTurn].score + 1;

        let picture1Parent = picture1.parentElement;
        let picture2Parent = picture2.parentElement;
        setTimeout(() => {
            picture1Parent.style.visibility = 'hidden';
            picture2Parent.style.visibility = 'hidden';
        }, 1500);

        updateDisplay();

        setTimeout(() => {
            checkWinner();
        }, 1500);
    } else {
        setTimeout(() => {
            picture1.parentElement.classList.remove('card-flip');
            picture2.parentElement.classList.remove('card-flip');
        }, 1000);
        gameTurn = (gameTurn + 1) % 2;

        updateDisplay();
    }

    cardOne = '';
    cardTwo = '';
}

function getAnimalType(picture) {
    const backgroundImage = picture.style.backgroundImage;
    const animal = pictures.find(e => backgroundImage.includes(e.image)).animal;
    return animal;
}

function checkWinner() {
    if (players[0].score + players[1].score == 12) {

        if (players[0].score > players[1].score) {
            winnerMessage.innerText = players[0].name + " är vinnaren!"
        } 
        else if (players[0].score < players[1].score) {
            winnerMessage.innerText = players[1].name + " är vinnaren!"
        }
         else {
            winnerMessage.innerText = "Det blev lika!"
        }

        gameContainer.style.display = 'none';
        winnerContainer.style.display = 'flex';

        updateDisplay();
    }
}

restartGameBtn.addEventListener('click', restartGame);
resetBtn.addEventListener('click', restartGame);

function restartGame() {
    winnerContainer.style.display = 'none';
    while (cardContainer.firstChild) {
        cardContainer.removeChild(cardContainer.lastChild)
    }

    startGame();
}