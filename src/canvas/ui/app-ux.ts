import { Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { AppGame } from './app-game';
import { GameStatus, getOpponent, StoneColor } from '../../common';
import { AppDrawable } from './app-drawable';
import { AppPlayerInfo } from './app-player-info';

export class AppUx implements AppDrawable {
    private view: Container;
    private playerInfo: { [key in StoneColor]: AppPlayerInfo };
    private gameStatus: GameStatus = GameStatus.STOPPED;

    constructor(
        private game: AppGame,
        private width: number,
        private height: number
    ) {
        this.view = new Container();

        const background = new Graphics();
        background.beginFill(0x242824);
        background.drawRect(0, 0, 320, 680);
        background.endFill();

        const gameStartButton = new Text('대국 시작', {
            fill: 0xFFFFFF
        });

        gameStartButton.x = this.width / 2 - gameStartButton.width / 2;
        gameStartButton.y = this.height / 2 - gameStartButton.height / 2;
        gameStartButton.interactive = true;
        gameStartButton.buttonMode = true;

        gameStartButton.on('click', () => {
            if (this.gameStatus === GameStatus.PLAYING) {
                this.game.event.gameEnded.emit();
            } else {
                this.game.event.gameStarted.emit();
            }
        });

        this.game.event.gameStarted.on(() => {
            this.gameStatus = GameStatus.PLAYING;
            gameStartButton.text = '대국 중지';
        });

        this.game.event.gameEnded.on(() => {
            this.gameStatus = GameStatus.STOPPED;
            gameStartButton.text = '대국 시작';
        });

        this.view.addChild(background);
        this.view.addChild(gameStartButton);

        const blackPlayer = new AppPlayerInfo(this.width, StoneColor.BLACK);
        this.view.addChild(blackPlayer.getView());

        const whitePlayer = new AppPlayerInfo(this.width, StoneColor.WHITE);
        whitePlayer.getView().y = this.height - (whitePlayer.getView() as Container).height;
        this.view.addChild(whitePlayer.getView());

        this.playerInfo = {
            [StoneColor.BLACK]: blackPlayer,
            [StoneColor.WHITE]: whitePlayer
        };

        this.game.event.turnChanged.on((turn) => {
            const opponent = getOpponent(turn);
            this.playerInfo[turn].active();
            this.playerInfo[opponent].inactive();
        });

        this.game.event.playerChanged.on(({color, player}) => {
            this.playerInfo[color].name = player.getName() === 'user' ? '플레이어': player.getName();
        });
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getView(): DisplayObject {
        return this.view;
    }
}
