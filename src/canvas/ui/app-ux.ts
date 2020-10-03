import { EventEmitter } from 'events';
import { Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { GameStauts } from '../../common/game-status';
import { StoneColor } from '../../common/stone-color';
import { AppEventManager } from '../core/app-event-manager';
import { AppPlayer } from '../player/app-player';
import { AppDrawable } from './app-drawable';
import { AppPlayerInfo } from './app-player-info';

export class AppUx implements AppDrawable {
    private view: Container;
    private event: AppEventManager

    private playerInfo: { [key in StoneColor]: AppPlayerInfo };

    private gameStatus: GameStauts = GameStauts.WAITING;

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
            if (this.gameStatus === GameStauts.PLAYING) {
                this.event.gameEnded.emit();
            } else {
                this.event.gameStarted.emit();
            }
        });

        this.event.gameStarted.on(() => {
            this.gameStatus = GameStauts.PLAYING;
            gameStartButton.text = '대국 중지';
        });

        this.event.gameEnded.on(() => {
            this.gameStatus = GameStauts.WAITING;
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
            const opponent = turn === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
            this.playerInfo[turn].active();
            this.playerInfo[opponent].inactive();
        });

        this.event.blackPlayerChanged.on((player: AppPlayer) => {
            this.playerInfo[StoneColor.BLACK].name = player.getName();
        });

        this.event.whitePlayerChanged.on((player: AppPlayer) => {
            this.playerInfo[StoneColor.WHITE].name = player.getName();
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
