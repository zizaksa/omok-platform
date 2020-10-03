import { Application, Graphics, InteractionEvent, Loader, Sprite } from 'pixi.js';
import { Coordinate } from '../../common/coordinate';
import { AppAsset } from './app-asset';
import { AppDrawable } from './app-drawable';
import { AppMouseHandler } from './app-mouse-handler';

export class AppCanvas {
    private app: Application;

    private displayWidth: number;
    private displayHeight: number;

    private mouseMoveHandlers: AppMouseHandler[] = [];
    private mouseClickHandlers: AppMouseHandler[] = [];

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

        const getPosition = (event: InteractionEvent) => {
            const originX = (event as any).data.originalEvent.clientX;
            const originY = (event as any).data.originalEvent.clientY;
            const localPosition = this.globalToLocal(originX, originY);
        
            return new Coordinate(localPosition.x, localPosition.y);
        };

        this.app.stage.on('mousemove', (event: InteractionEvent) => {
            const pos = getPosition(event);

            this.mouseMoveHandlers.forEach(handler => handler(pos.x, pos.y));
        });

        this.app.stage.on('click', (event: InteractionEvent) => {
            const pos = getPosition(event);

            this.mouseClickHandlers.forEach(handler => handler(pos.x, pos.y));
        });
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
    
    globalToLocal(x: number, y: number): Coordinate {
        const scrollX = document.body.scrollLeft;
        const scrollY = document.body.scrollTop;
        const offset = this._cumulativeOffset(this.app.renderer.view);
        const localX = this.width * (x - offset.left + scrollX) / this.displayWidth;
        const localY = this.height * (y - offset.top + scrollY) / this.displayHeight;
        return new Coordinate(localX, localY);
    }

    _cumulativeOffset(element: HTMLElement) {
        let top = 0, left = 0;
        do {
            top += element.offsetTop || 0;
            left += element.offsetLeft || 0;
            element = element.offsetParent as HTMLElement;
        } while (element);

        return {
            top: top,
            left: left
        };
    };

    onMouseMove(handler: AppMouseHandler) {
        this.mouseMoveHandlers.push(handler);
    }

    onMouseClick(handler: AppMouseHandler) {
        this.mouseClickHandlers.push(handler);
    }

    private update() {
        this.app.render();
    }
}