import { StoneColor } from '../common';
import { AppGame } from './ui/app-game';

const container = document.getElementById('container');
const game = new AppGame(container);

game.init().then(() => {
    console.log('Game initialized'); 
});

const blackPlayerUserBtn = document.getElementById('black-player-user');
const blackPlayerAIBtn = document.getElementById('black-player-ai');
const blackPlayerAIList = document.getElementById('black-ai-select');
const whitePlayerUserBtn = document.getElementById('white-player-user');
const whitePlayerAiBtn = document.getElementById('white-player-ai');
const whitePlayerAIList = document.getElementById('white-ai-select');

blackPlayerUserBtn.addEventListener('click', () => {
    // blackPlayerAIList.setAttribute('disabled', 'disabled');
    game.changePlayer(StoneColor.BLACK, 'user');
});

blackPlayerAIBtn.addEventListener('click', () => {
    // blackPlayerAIList.removeAttribute('disabled');
    game.changePlayer(StoneColor.BLACK, 'ai');
});

whitePlayerUserBtn.addEventListener('click', () => {
    // whitePlayerAIList.setAttribute('disabled', 'disabled');
    game.changePlayer(StoneColor.WHITE, 'user');
});

whitePlayerAiBtn.addEventListener('click', () => {
    // whitePlayerAIList.removeAttribute('disabled');
    game.changePlayer(StoneColor.WHITE, 'ai');
});

function changeBlackPlayer(type) {
    console.log(type);
}