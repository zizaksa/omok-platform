import { Container, DisplayObject } from "pixi.js";
import { AppDrawable } from "../app-drawable";

export class UIList implements AppDrawable {
    private view: Container;

    private components: AppDrawable[] = [];
    private positions: {x: number, y: number}[] = [];

    constructor() {
        this.view = new Container();
    }

    getWidth(): number {
        return this.view.width;
    }

    getHeight(): number {
        return this.view.height;
    }

    getView(): DisplayObject {
        return this.view;
    }

    getLength(): number {
        return this.components.length;
    }

    addDrawable(drawable: AppDrawable) {
        const v = drawable.getView();
        v.x = 0;
        v.y = this.view.height + 10;
        this.view.addChild(v);

        this.components.push(drawable);
        this.positions.push({x: v.x, y: v.y});

        this.redraw();

        return this;
    }

    private redraw() {
        this.components.forEach((c, i) => {
            this.positions[i].x = this.getWidth() / 2 - c.getWidth() / 2;
            c.getView().x = this.positions[i].x;
        });
    }
}
