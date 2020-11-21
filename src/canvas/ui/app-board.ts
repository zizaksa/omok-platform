import { Container, DisplayObject, Graphics, InteractionEvent, Sprite, Text } from 'pixi.js';
import { AppGame } from './app-game';
import { Coordinate, DefaultOmokRule, OmokRule, StoneColor } from '../../common';
import { AppAsset } from './app-asset';
import { AppDrawable, AppDrawableUtils } from './app-drawable';
import { AppStone } from './app-stone';

export class AppBoard implements AppDrawable {
    private lineWidth: number;
    private dotSize: number;
    private gridWidth: number;
    private gridHeight: number;

    private gridColor: number;

    private view: Container;
    private hintStoneDrawables: { [key in StoneColor]: AppStone };

    private placedStones: {
        pos: Coordinate,
        stone: AppStone;
    }[];

    private hintStoneColor: StoneColor = StoneColor.BLACK;

    private waitingScreen: Container;

    constructor(
        private game: AppGame,
        private width: number, 
        private height: number,
        private size: number = 19
    ) {
        this.gridColor = 0x000;

        this.placedStones = [];

        // 보드 크기에 맞춰 그리드 사이즈 계산
        this.lineWidth = 1;
        this.dotSize = 4;
        this.gridWidth = (width - this.lineWidth) / (size + 1);
        this.gridHeight = (height - this.lineWidth) / (size + 1);

        this.hintStoneDrawables = {
            [StoneColor.BLACK]: this.createStone(StoneColor.BLACK, true),
            [StoneColor.WHITE]: this.createStone(StoneColor.WHITE, true)
        };

        this.view = new Container();
        
        this.drawBoard();
        this.drawGrid();

        this.view.on('mousemove', (event: InteractionEvent) => {        
            const point = event.data.getLocalPosition(this.view);
            const gridPos = this.getGridPosition(point.x, point.y);

            if (gridPos.x < 0) {
                this.eraseStoneHint();
            } else {
                this.hintStone(gridPos);
            }
        });

        this.view.on('click', (event: InteractionEvent) => {
            const point = event.data.getLocalPosition(this.view);
            const gridPos = this.getGridPosition(point.x, point.y);

            if (gridPos.x >= 0 && this.game.omokRule.checkValidity(this.hintStoneColor, gridPos)) {
                this.game.event.gridSelected.emit(gridPos);
            }
        });

        this.waitingScreen = new Container();
        const waitingOverlay = new Graphics();
        waitingOverlay.beginFill(0x000);
        waitingOverlay.drawRect(0, 0, this.width, this.height);
        waitingOverlay.alpha = 0.5;
        waitingOverlay.endFill();
        this.waitingScreen.addChild(waitingOverlay);
        const waitingText = new Text('대국이 준비중입니다.', {
            fill: 0xFFFFFF,
            fontSize: 24,
            fontFamily: 'Kostar',
            fontStyle: 'bold'
        });
        AppDrawableUtils.setCenter(waitingText, this.view);
        this.waitingScreen.addChild(waitingText);

        this.game.event.gameStarted.on(() => {
            this.hideWaiting();
        });

        this.game.event.gameEnded.on(() => {
            // this.showWaiting();
            this.disableInteraction();
        });
        this.showWaiting();
    }

    drawBoard() {
        const boardRes = AppAsset.get(AppAsset.IMG_BOARD);
        const board = new Sprite(boardRes.texture);
        board.width = this.width;
        board.height = this.height;
        this.view.addChild(board);
    }

    drawGrid() {
        const grid = new Graphics();
        grid.lineStyle(1, this.gridColor, 1);

        // 가로줄
        for (let y = 0; y < this.size; y++) {
            const begin = this.getDrawPosition(0, y);
            const end = this.getDrawPosition(this.size - 1, y);
            grid.moveTo(begin.x, begin.y);
            grid.lineTo(end.x, end.y);
        }

        // 세로줄
        for (let x = 0; x < this.size; x++) {
            const begin = this.getDrawPosition(x, 0);
            const end = this.getDrawPosition(x, this.size - 1);
            grid.moveTo(begin.x, begin.y);
            grid.lineTo(end.x, end.y);
        }

        // 화점
        const centrify = (n) => {
            return n * Math.floor(this.size / 3) + Math.floor(this.size / 6);
        };
        for (let i = 0; i < 9; i++) {
            const dot = new Graphics();
            dot.beginFill(this.gridColor);
            dot.drawCircle(0, 0, this.dotSize);
            dot.endFill();

            const pos = this.getDrawPosition(centrify(i % 3), centrify(Math.floor(i / 3)));
            dot.x = pos.x;
            dot.y = pos.y;
            grid.addChild(dot);
        }

        this.view.addChild(grid);
    }

    showWaiting() {
        this.view.addChild(this.waitingScreen);
    }

    hideWaiting() {
        this.view.removeChild(this.waitingScreen);
    }

    clearBoard() {
        this.game.omokRule.init();
        this.eraseStoneHint();
        this.placedStones.forEach(({pos, stone}) => {
            this.view.removeChild(stone.getView());
        });
        this.placedStones = [];
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

    getDrawPosition(pos: Coordinate): Coordinate;
    getDrawPosition(x: number, y: number): Coordinate;
    getDrawPosition(xOrPos: number | Coordinate, y?: number): Coordinate {
        const cord = new Coordinate();

        if (typeof xOrPos === 'number') {
            cord.x = this.gridWidth + xOrPos * this.gridWidth;
            cord.y = this.gridHeight + y * this.gridHeight;
        } else {
            cord.x = this.gridWidth + xOrPos.x * this.gridWidth;
            cord.y = this.gridHeight + xOrPos.y * this.gridHeight;
        }

        return cord;
    }

    getGridPosition(pos: Coordinate): Coordinate;
    getGridPosition(x: number, y: number): Coordinate;
    getGridPosition(xOrPos: number | Coordinate, y?: number): Coordinate {
        let x: number;

        if (typeof xOrPos === 'number') {
            x = xOrPos;
        } else {
            x = xOrPos.x;
            y = xOrPos.y;
        }
        
        const gridX = Math.round((x - this.gridWidth) / this.gridWidth);
        const gridY = Math.round((y - this.gridHeight) / this.gridHeight);

        if (gridX < 0 || gridX >= this.size ||
            gridY < 0 || gridY >= this.size) {
            return new Coordinate(-1, -1);
        }

        return new Coordinate(gridX, gridY);
    }

    eraseStoneHint() {
        this.view.removeChild(this.hintStoneDrawables[StoneColor.BLACK].getView());
        this.view.removeChild(this.hintStoneDrawables[StoneColor.WHITE].getView());
    }

    setHintStoneColor(color: StoneColor) {
        this.hintStoneColor = color;
    }

    hintStone(pos: Coordinate) {
        if (this.game.omokRule.getStoneColor(pos) !== null) {
            this.eraseStoneHint();
            return;
        }

        this.eraseStoneHint();
        const realPos = this.getDrawPosition(pos.x, pos.y);
        const stone = this.hintStoneDrawables[this.hintStoneColor];
        stone.setPosition(realPos);
        this.view.addChild(this.hintStoneDrawables[this.hintStoneColor].getView());
    }

    createStone(color: StoneColor, forHint?: boolean): AppStone {
        // @TODO change stone size based on board size
        return new AppStone(30, color, forHint);
    }

    placeStone(color: StoneColor, pos: Coordinate): boolean {
        const idx = pos.x + pos.y * this.size;

        if (this.game.omokRule.checkValidity(color, pos)) {
            this.game.omokRule.placeStone(color, pos);
            const stone = this.createStone(color);
            stone.setPosition(this.getDrawPosition(pos));
            this.placedStones.push({ pos, stone });
            this.view.addChild(stone.getView());

            return true;
        }

        return false;
    }

    waitUesrSelection(autoDisable: boolean): Promise<Coordinate> {
        if (!this.view.interactive) {
            return  Promise.reject('interaction is not enabled');
        }

        return new Promise((resolve, reject) => {
            this.game.event.gridSelected.once((pos: Coordinate) => {
                if (autoDisable) {
                    this.disableInteraction();
                }
                resolve(pos);
            });
        });
    }

    enableInteraction(color: StoneColor) {
        this.hintStoneColor = color;
        this.view.interactive = true;
    }

    disableInteraction() {
        this.eraseStoneHint();
        this.view.interactive = false;
    }
}
