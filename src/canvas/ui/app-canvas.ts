import { Application } from 'pixi.js';
import { AppAsset } from './app-asset';
import { AppDrawable } from './app-drawable';

export class AppCanvas {
    private app: Application;

    private displayWidth: number;
    private displayHeight: number;

    constructor (private width: number, private height: number) {
        this.displayWidth = width;
        this.displayHeight = height;

        this.app = new Application({ 
            width,
            height,
            backgroundColor: 0xFFFFFF,
            antialias: false,
            transparent: false,
            resolution: 1
         });
         
        this.app.stage.interactive = true;
    }

    async init() {
        const assets = AppAsset.getInstance();
        await assets.load();
    }

    addDrawable(drawable: AppDrawable) {
        this.app.stage.addChild(drawable.getView());
    }

    removeDrawable(drawable: AppDrawable) {
        this.app.stage.removeChild(drawable.getView());
    }

    getWidth(): number {
        return this.width;
    }

    getHeight(): number {
        return this.height;
    }

    getView() {
        return this.app.view;
    }
}