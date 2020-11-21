import { Container, DisplayObject, Graphics, ObservablePoint, Text } from "pixi.js";
import { AppGame } from "..";
import { AppDrawable } from "../app-drawable";
import { UIButton } from "./ui-button";

export class UISettingPopup implements AppDrawable {
    private view: Container;

    private width: number;
    private height: number;

    public onSave: () => void;
    public onClose: () => void;

    constructor(private game: AppGame) {
        this.width = this.game.canvasWidth - this.game.popupMargin * 2;
        this.height = this.game.canvasHeight - this.game.popupMargin * 2;

        this.view = new Container();

        let v: Container;

        const background = new Graphics();
        background
            .beginFill(0x000, 0.8)
            .drawRect(0, 0, this.width, this.height)
            .endFill();
        
        this.view.interactive = true;
        this.view.addChild(background);

        // Close button
        const closeButton = new UIButton('닫기', 80, 30)
            .setBackground(0xc62828)
            .setTextStyle({
                fontFamily: 'Kostar',
                fontSize: 18,
                fill: 0xFFFFFF
            });
        // right
        v = closeButton.getView();
        v.x = this.width - v.width - 20;
        v.y = this.height - v.height - 20;
        closeButton.on('click', () => {
            if (this.onClose) {
                this.onClose();
            }
        });
        this.view.addChild(closeButton.getView());

        // Save button
        const saveButton = new UIButton('저장', 80, 30)
            .setBackground(0x004d40)
            .setTextStyle({
                fontFamily: 'Kostar',
                fontSize: 18,
                fill: 0xFFFFFF
            });
        v = saveButton.getView();
        v.x = closeButton.getView().x - v.width - 10;
        v.y = closeButton.getView().y;
        saveButton.on('click', () => {
            if (this.onSave) {
                this.onSave();
            }
        });

        this.view.on('mousemove', (e) => {
            e.stopPropagation();
        });

        this.view.addChild(closeButton.getView());
        this.view.addChild(saveButton.getView());

        this.drawPlayerSettings();
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

    private drawPlayerSettings() {
        const textStyle = {
            fontFamily: 'Kostar',
            fontSize: 16,
            fill: 0xFFFFFF
        };
        let text = new Text('흑돌 플레이어', textStyle);
        text.position.set(20, 20);
        this.view.addChild(text);

        text = new Text('백돌 플레이어', textStyle);
        text.position.set(20, 60);
        this.view.addChild(text);
    }
}
