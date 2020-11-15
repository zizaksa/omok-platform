import { AppGame } from './ui/app-game';

const container = document.getElementById('container');
const appCanvas = new AppGame(container);

appCanvas.init().then(() => {
    console.log('Game initialized'); 
});