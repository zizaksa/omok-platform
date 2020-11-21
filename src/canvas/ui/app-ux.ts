import { Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { AppGame } from './app-game';
import { GameStatus, getOpponent, StoneColor } from '../../common';
import { AppDrawable, AppDrawableUtils } from './app-drawable';
import { AppPlayerInfo } from './app-player-info';
import { UIButton, UIList, UISettingPopup } from './component';

export class AppUx implements AppDrawable {
    private view: Container;

    private width: number;
    private height: number;

    private playerInfo: { [key in StoneColor]: AppPlayerInfo };
    private gameStatus: GameStatus = GameStatus.STOPPED;

    private settingPopup: UISettingPopup;

    constructor(
        private game: AppGame
    ) {
        this.width = this.game.uxCanvasWidth;
        this.height = this.game.uxCanvasHeight;

        this.view = new Container();
        this.view.x = this.game.boardWidth;

        this.createPopup();
        this.drawBackground();
        this.drawPlayerInfo();
        this.drawButton();
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

    private drawBackground() {
        const background = new Graphics();
        background.beginFill(0xbdbdbd);
        background.drawRect(0, 0, 320, 680);
        background.endFill();

        this.view.addChild(background);
    }

    private drawPlayerInfo() {
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

    private drawButton() {
        const list = new UIList();
        const gameStartButton = new UIButton('대국 시작', 120, 60);

        gameStartButton
            .setTextStyle({
                color: 0x000,
                fontFamily: 'Kostar'
            })
            .on('click', () => {
                if (this.gameStatus === GameStatus.PLAYING) {
                    this.game.event.gameEnded.emit();
                } else {
                    this.game.event.gameStarted.emit();
                }
            });

        this.game.event.gameStarted.on(() => {
            this.gameStatus = GameStatus.PLAYING;
            gameStartButton.setText('대국 중지');
        });

        this.game.event.gameEnded.on(() => {
            this.gameStatus = GameStatus.STOPPED;
            gameStartButton.setText('대국 시작');
        });

        list.addDrawable(gameStartButton);

        const settingButton = new UIButton('설정', 120, 60)
            .setTextStyle({
                color: 0x000,
                fontFamily: 'Kostar'
            })
            .on('click', () => {
                this.openSettingPopup();
            });

        list.addDrawable(settingButton);

        AppDrawableUtils.setCenter(list.getView() as Container, this.view);

        this.view.addChild(list.getView());
    }

    private createPopup() {
        this.settingPopup = new UISettingPopup(this.game);
        const v = this.settingPopup.getView();
        v.name = 'SettingPopup';
        v.x = -this.view.x + 40;
        v.y = 40;

        this.settingPopup.onClose = () => {
            this.closeSettingPopup();
        };
        
        this.settingPopup.onSave = () => {
            this.closeSettingPopup();
        };
    }

    private openSettingPopup() {
        this.view.addChild(this.settingPopup.getView());
    }

    private closeSettingPopup() {
        this.view.removeChild(this.settingPopup.getView());
    }
}
