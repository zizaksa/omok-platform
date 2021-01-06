import { StoneColor } from '../common';
import { AppGame } from './ui/app-game';

const container = document.getElementById('container');
const game = new AppGame(container, {
	serverOptions: {
		host: '<Put your host>',
		port: '<Put your port>'
	}
});

game.init().then(() => {
    console.log('Game initialized'); 
});

const blackPlayerUserBtn = document.getElementById('black-player-user');
const blackPlayerAIBtn = document.getElementById('black-player-ai');
const blackPlayerAIList = document.getElementById('black-ai-select');
const whitePlayerUserBtn = document.getElementById('white-player-user');
const whitePlayerAIBtn = document.getElementById('white-player-ai');
const whitePlayerAIList = document.getElementById('white-ai-select');

blackPlayerUserBtn.addEventListener('click', () => {
    blackPlayerAIList.setAttribute('disabled', 'disabled');
    game.changePlayer(StoneColor.BLACK, 'user');
});

blackPlayerAIBtn.addEventListener('click', () => {
    game.server.getAIList().then(list => {
        blackPlayerAIList.innerHTML = '';

        list.forEach(ai => {
            const opt = document.createElement('option');
            opt.appendChild(document.createTextNode(ai));
            opt.value = ai;
            blackPlayerAIList.appendChild(opt);
        });

        blackPlayerAIList.removeAttribute('disabled');

        if (list.length > 0) {
            game.changePlayer(StoneColor.BLACK, list[0]);
        }
    });
});

blackPlayerAIList.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const name = target.options[target.selectedIndex].value;
    game.changePlayer(StoneColor.BLACK, name);
});

whitePlayerUserBtn.addEventListener('click', () => {
    whitePlayerAIList.setAttribute('disabled', 'disabled');
    game.changePlayer(StoneColor.WHITE, 'user');
});

whitePlayerAIBtn.addEventListener('click', () => {
    game.server.getAIList().then(list => {
        whitePlayerAIList.innerHTML = '';

        list.forEach(ai => {
            const opt = document.createElement('option');
            opt.appendChild(document.createTextNode(ai));
            opt.value = ai;
            whitePlayerAIList.appendChild(opt);
        });

        whitePlayerAIList.removeAttribute('disabled');

        if (list.length > 0) {
            game.changePlayer(StoneColor.WHITE, list[0]);
        }
    });
});

whitePlayerAIList.addEventListener('change', (e) => {
    const target = e.target as HTMLSelectElement;
    const name = target.options[target.selectedIndex].value;
    game.changePlayer(StoneColor.WHITE, name);
});

function changeBlackPlayer(type) {
    console.log(type);
}