import { Container, DisplayObject, Text } from "pixi.js";
import { AppDrawable } from "../app-drawable";

export class UITextButton implements AppDrawable {
    private btn: Text;

    constructor(text: string) {
        this.btn = new Text(text, {
            fontFamily: 'Kostar'
        });
        this.btn.interactive = true;
        this.btn.buttonMode = true;
    }

    setText(text: string) {
        this.btn.text = text;
        return this;
    }

    setColor(color: number) {
        this.btn.style.fill = color;
        return this;
    }

    setPosition(x: number, y: number) {
        this.btn.x = x;
        this.btn.y = y;
        return this;
    }

    getWidth(): number {
        return this.btn.width;
    }

    getHeight(): number {
        return this.btn.height;
    }

    getView(): DisplayObject {
        return this.btn;
    }

    on(event: string, fn: Function) {
        this.btn.on(event, fn);
        return this;
    }
}
