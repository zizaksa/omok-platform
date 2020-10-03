import { Container, DisplayObject, Graphics, Sprite, Text } from 'pixi.js';
import { StoneColor } from '../../common/stone-color';
import { AppAsset } from './app-asset';
import { AppDrawable, AppDrawableUtils } from './app-drawable';

export class AppPlayerInfo implements AppDrawable {
    private height: number;

    private view: Container;

    private bg: Graphics;
    private nameText: Text;

    private _name: string;
    get name(): string {
        return this._name;
    }
    set name(_name: string) {
        this._name = _name;
        this.nameText.text = _name;
    }

    constructor(
        private width: number,
        private color: StoneColor
    ) {
        this.height = width * 0.4;

        const borderSize = 3;
        this.view = new Container();
        this.bg = new Graphics();
        this.bg.beginFill(0x000);
        this.bg.drawRect(0, 0, this.width, this.height);
        this.bg.endFill();

        this.view.addChild(this.bg);

        const stone = new Sprite(AppAsset.get(color == StoneColor.BLACK ? AppAsset.IMG_BLACK_STONE : AppAsset.IMG_WHITE_STONE).texture);
        stone.width = 50;
        stone.height = 50;
        stone.x = this.width - stone.width - 10;
        AppDrawableUtils.setVerticalCenter(stone, this.view);
        this.view.addChild(stone);

        this._name = '플레이어를 선택해주세요';
        this.nameText = new Text(this._name, {
            fontSize: 13,
            fill: 0xFFFFFF
        });
        this.nameText.anchor.x = 1;
        this.nameText.x = stone.x - 10;
        AppDrawableUtils.setVerticalCenter(this.nameText, this.view);
        this.view.addChild(this.nameText);
    }

    active() {
        this.view.alpha = 1;
    }

    inactive() {
        this.view.alpha = 0.4;
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
