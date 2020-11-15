import { Container, DisplayObject, Sprite } from 'pixi.js';
import { Coordinate, StoneColor } from '../../common';
import { AppAsset } from './app-asset';
import { AppDrawable } from './app-drawable';

export class AppStone implements AppDrawable {
    private width: number;
    private view: Container;

    constructor(width: number, color: StoneColor, forHint?: boolean) {
        this.width = width;
        this.view = new Container();

        const res = AppAsset.get(
            color === StoneColor.BLACK ?
            AppAsset.IMG_BLACK_STONE :
            AppAsset.IMG_WHITE_STONE
        );
        
        const sprite = new Sprite(res.texture);
        sprite.anchor.set(0.5, 0.5);
        sprite.width = width;
        sprite.height = width;

        if (forHint) {
            sprite.alpha = 0.4;
        }

        this.view.addChild(sprite);
    }

    setPosition(pos: Coordinate);
    setPosition(x: number, y: number);
    setPosition(xOrPos: number | Coordinate, y?: number) {
        if (typeof xOrPos === 'number') {
            this.view.x = xOrPos;
            this.view.y = y;
        } else {
            this.view.x = xOrPos.x;
            this.view.y = xOrPos.y;
        }
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.width;
    }

    getView(): DisplayObject {
        return this.view;
    }
}
