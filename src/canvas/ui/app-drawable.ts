import { DisplayObject } from "pixi.js";

export interface AppDrawable {
    getWidth(): number;
    getHeight(): number;
    getView(): DisplayObject;
}
