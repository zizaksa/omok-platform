import { Container, DisplayObject, Graphics, Text } from "pixi.js";
import { AppDrawable, AppDrawableUtils } from "../app-drawable";

export class UIButton implements AppDrawable {
    private view: Container;
    private bg: Graphics;
    private text: Text;

    constructor(text: string, private width: number, private height: number) {
        this.view = new Container();

        this.bg = new Graphics();
        this.bg
            .beginFill(0xFFFFFF, 0)
            .drawRect(0, 0, width, height)
            .endFill();

        this.text = new Text(text);

        this.view.interactive = true;
        this.view.buttonMode = true;

        this.view.addChild(this.bg);
        this.view.addChild(this.text);
        
        this.redraw();
    }

    setText(text: string) {
        this.text.text = text;
        return this;
    }

    setBackground(color: number, alpha?: number) {
        this.bg
            .beginFill(color, alpha)
            .drawRect(0, 0, this.width, this.height)
            .endFill()
        return this;
    }

    setTextStyle(style: any) {
        this.text.style = style;
        this.redraw();
        return this;
    }

    setTextColor(color: number) {
        this.text.style.fill = color;
        this.redraw();
        return this;
    }

    setPosition(x: number, y: number) {
        this.view.x = x;
        this.view.y = y;
        this.redraw();
        return this;
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getView(): Container {
        return this.view;
    }

    on(event: string, fn: Function) {
        this.view.on(event, fn);
        return this;
    }

    private redraw() {
        this.text.x = this.width / 2 - this.text.width / 2;
        this.text.y = this.height / 2 - this.text.height / 2;
    }
}
