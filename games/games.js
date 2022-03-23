import { 
    logout, 
    checkAuth,
    getGames,
    createGame,
} from '../fetch-utils.js';
import { renderGame } from '../render-utils.js';

const currentGameEl = document.getElementById('current-game-container');
const pastGamesEl = document.getElementById('past-games-container');
const logoutButton = document.getElementById('logout');

const nameForm = document.getElementById('name-form');
const teamOneAddButton = document.getElementById('team-one-add-button');
const teamTwoAddButton = document.getElementById('team-two-add-button');
const teamOneSubtractButton = document.getElementById('team-one-subtract-button');
const teamTwoSubtractButton = document.getElementById('team-two-subtract-button');
const finishGameButton = document.getElementById('finish-game-button');
const teamOneLabel = document.getElementById('team-one-name');
const teamTwoLabel = document.getElementById('team-two-name');

checkAuth();

let pastGames = [];

let currentGame = {
    name1: '',
    name2: '',
    score1: 0,
    score2: 0,
};

nameForm.addEventListener('submit', (e) => {
    e.preventDefault();
    // don't forget to prevent the default form behavior!
    const formData = new FormData(nameForm);
    // get the name data from the form
    const name1 = formData.get('team-one');
    const name2 = formData.get('team-two');
    // set the state to this data from the form
    currentGame.name1 = name1;
    currentGame.name2 = name2;
    // reset the form values
    
    displayCurrentGameEl();
    nameForm.reset();
});


teamOneAddButton.addEventListener('click', () => {
    // increment the current state for team one's score
    currentGame.score1++;
    displayCurrentGameEl();
});

teamTwoAddButton.addEventListener('click', () => {
    // increment the current state for team two's score
    currentGame.score2++;
    displayCurrentGameEl();
});

teamOneSubtractButton.addEventListener('click', () => {
    // decrement the current state for team one's score
    currentGame.score1--;
    displayCurrentGameEl();
});

teamTwoSubtractButton.addEventListener('click', () => {
    // decrement the current state for team two's score
    currentGame.score2--;
    displayCurrentGameEl();
});

finishGameButton.addEventListener('click', async() => {
    // create a new game using the current game state
    await createGame(currentGame);
    // after creating this new game, re-fetch the games to get the updated state and display them (hint: call displayAllGames())
    
    const games = await getGames();

    pastGames = games;

    displayAllGames();

    currentGame = {
        name1: '',
        name2: '',
        score1: 0,
        score2: 0
    };

    displayCurrentGameEl();
});

logoutButton.addEventListener('click', () => {
    logout();
});

 // on load . . .
window.addEventListener('load', async() => {
    const games = await getGames();

    if (games) {
        pastGames = games;

        displayAllGames();
    }
    // display all past games (hint: call displayAllGames())
    displayAllGames();
});


function displayCurrentGameEl() {
    // clear out the current game div
    currentGameEl.textContent = '';
    // change the label to show team one's name;
    teamOneLabel.textContent = currentGame.name1;
    // change the label to show team two's name;
    teamTwoLabel.textContent = currentGame.name2;
    // call the render game function to create a game element
    const ongoingGameEl = renderGame(currentGame);
    // append the element to the cleared out current game div
    currentGameEl.append(ongoingGameEl);
}


function displayAllGames() {
    // clear out the past games list in the DOM
    pastGamesEl.textContent = '';
    // FETCH ALL GAMES from supabase
    getGames();
    // loop through the past games 
    
    // render and append a past game for each past game in state
    for (let game of pastGames) {
        const gameEl = renderGame(game);

        gameEl.classList.add('past');
        
        pastGamesEl.append(gameEl);
    }
}


displayCurrentGameEl();
