import { EventEmitter } from 'events';
import { Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { GameStatus } from '../../common/game-status';
import { getOpponent, StoneColor } from '../../common/stone-color';
import { AppEventManager } from '../core/app-event-manager';
import { AppPlayer } from '../player/app-player';
import { AppDrawable } from './app-drawable';
import { AppPlayerInfo } from './app-player-info';

export class AppUx implements AppDrawable {
    private view: Container;
    private event: AppEventManager

    private playerInfo: { [key in StoneColor]: AppPlayerInfo };

    private gameStatus: GameStatus = GameStatus.STOPPED;

    constructor(
        private width: number,
        private height: number
    ) {
        this.event = AppEventManager.getInstance();
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
                this.event.gameEnded.emit();
            } else {
                this.event.gameStarted.emit();
            }
        });

        this.event.gameStarted.on(() => {
            this.gameStatus = GameStatus.PLAYING;
            gameStartButton.text = '대국 중지';
        });

        this.event.gameEnded.on(() => {
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

        this.event.turnChanged.on((turn) => {
            const opponent = getOpponent(turn);
            this.playerInfo[turn].active();
            this.playerInfo[opponent].inactive();
        });

        this.event.playerChanged.on(({color, player}) => {
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
