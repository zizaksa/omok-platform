import { Container, DisplayObject, Graphics, Text } from "pixi.js";
import { AppGame } from "..";
import { AppDrawable } from "../app-drawable";

export class UIPopup implements AppDrawable {
    private view: Container;

    private width: number;
    private height: number;

    constructor(private game: AppGame) {
        this.width = this.game.canvasWidth - this.game.popupMargin * 2;
        this.height = this.game.canvasHeight - this.game.popupMargin * 2;

        this.view = new Container();

        const background = new Graphics();
        background
            .beginFill(0x000, 0.8)
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        
        this.view.interactive = true;
        this.view.addChild(background);

        // Close button
        const closeBtn = new Container();
        const closeBtnBg = new Graphics();
        closeBtnBg
            .beginFill(0xFF0000)
            .drawRect(0, 0, 80, 40)
            .endFill();
        const closeBtnText = new Text('닫기', {
            fill: 0xFFFFFF,
            fontFamily: 'Kostar',
            fontSize: 32
        });
        closeBtn.addChild(closeBtnBg, closeBtnText);
        this.view.addChild(closeBtn);
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
