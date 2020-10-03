import { EventEmitter } from 'events';
import { Container, DisplayObject, Graphics, Text } from 'pixi.js';
import { AppEventManager } from '../core/app-event-manager';
import { AppDrawable } from './app-drawable';

export class AppUx implements AppDrawable {
    private view: Container;
    private event: AppEventManager

    constructor(
        private width: number,
        private height: number
    ) {
        this.event = AppEventManager.getInstance();
        this.view = new Container();

        const background = new Graphics();
        background.beginFill(0x000);
        background.drawRect(0, 0, 320, 680);
        background.endFill();

        const gameStartButton = new Text('Game Start!', {
            fill: 0xFFFFFF
        });

        gameStartButton.x = this.width / 2 - gameStartButton.width / 2;
        gameStartButton.y = this.height / 2 - gameStartButton.height / 2;
        gameStartButton.interactive = true;
        gameStartButton.buttonMode = true;

        gameStartButton.on('click', () => {
            this.event.gameStarted.emit();
        });

        this.view.addChild(background);
        this.view.addChild(gameStartButton);
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
