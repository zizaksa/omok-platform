import { EventEmitter } from 'events';
import { Container, DisplayObject, Graphics } from 'pixi.js';
import { AppBoard } from './app-board';
import { AppDrawable } from './app-drawable';

export class AppUx implements AppDrawable {
    private view: Container;

    private startGameButtonEvent = new EventEmitter();

    constructor(private width: number,
                private height: number,
                private board: AppBoard) {
        this.view = new Container();

        const g = new Graphics();
        g.beginFill(0x000);
        g.drawRect(0, 0, 320, 680);
        g.endFill();

        const button = new Graphics();
        button.beginFill(0xffffff);
        button.drawRect(50, 50, 100, 80);
        button.endFill();
        button.buttonMode = true;

        button.interactive = true;
        button.on('click', () => {
            this.startGameButtonEvent.emit('start');
        });

        this.view.addChild(g);
        this.view.addChild(button);
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

    get startGameButtonClicked(): EventEmitter {
        return this.startGameButtonEvent;
    }
}
