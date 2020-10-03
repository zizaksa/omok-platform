import { Container, DisplayObject, Sprite } from 'pixi.js';
import { Coordinate } from '../../common/coordinate';
import { AppAsset } from './app-asset';
import { AppDrawable } from './app-drawable';

export class AppStone implements AppDrawable {
    public static readonly WHITE = 'WHITE';
    public static readonly BLACK = 'BLACK';

    private width: number;
    private view: Container;

    constructor(width: number, color: AppStoneColor, forHint?: boolean) {
        this.width = width;
        this.view = new Container();

        const res = AppAsset.get(
            color === AppStone.WHITE ? 
            AppAsset.IMG_WHITE_STONE :
            AppAsset.IMG_BLACK_STONE
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

export type AppStoneColor = 'BLACK' | 'WHITE';
