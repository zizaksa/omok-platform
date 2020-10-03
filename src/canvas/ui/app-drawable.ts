import { Container, DisplayObject } from 'pixi.js';

export interface AppDrawable {
    getWidth(): number;
    getHeight(): number;
    getView(): DisplayObject;
}

export class AppDrawableUtils {
    private constructor() {}

    static setCenter(object: Container, parent: Container) {
        this.setHorinzontalCenter(object, parent);
        this.setVerticalCenter(object, parent);
    }

    static setHorinzontalCenter(object: Container, parent: Container) {
        object.x = parent.width / 2 - object.width / 2;
    }
    
    static setVerticalCenter(object: Container, parent: Container) {
        object.y = parent.height / 2 - object.height / 2;
    }
}
