import { Container, DisplayObject, Graphics, Sprite } from "pixi.js";
import { Coordinate } from "../../common/coordinate";
import { OmokRule } from "../../common/omok-rule";
import { AppAsset } from "./app-asset";
import { AppDrawable } from "./app-drawable";
import { AppStone, AppStoneColor } from "./app-stone";

export class AppBoard implements AppDrawable {
    private lineWidth: number;
    private dotSize: number;
    private gridWidth: number;
    private gridHeight: number;

    private gridColor: number;

    private view: Container;

    private hintStoneDrawables: { [key in AppStoneColor]: AppStone };

    private stoneHintAllowed: boolean = false;

    private placedStones: {
        pos: Coordinate,
        stone: AppStone;
    }[];

    constructor(private rule: OmokRule,
                private width: number, 
                private height: number,
                private size: number = 19) {

        this.gridColor = 0x000;

        this.placedStones = [];

        // 보드 크기에 맞춰 그리드 사이즈 계산
        this.lineWidth = 1;
        this.dotSize = 4;
        this.gridWidth = (width - this.lineWidth) / (size + 1);
        this.gridHeight = (height - this.lineWidth) / (size + 1);

        this.hintStoneDrawables = {
            [AppStone.BLACK]: this.createStone(AppStone.BLACK, true),
            [AppStone.WHITE]: this.createStone(AppStone.WHITE, true)
        };

        this.view = new Container();
        
        this.drawBoard();
        this.drawGrid();
    }

    drawBoard() {
        let boardRes = AppAsset.get(AppAsset.IMG_BOARD);
        let board = new Sprite(boardRes.texture);
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
        }
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

    clearBoard() {
        this.rule.init();
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
        
        let gridX = Math.round((x - this.gridWidth) / this.gridWidth);
        let gridY = Math.round((y - this.gridHeight) / this.gridHeight);

        if (gridX < 0 || gridX >= this.size ||
            gridY < 0 || gridY >= this.size) {
            return new Coordinate(-1, -1);
        }

        return new Coordinate(gridX, gridY);
    }

    eraseStoneHint() {
        this.view.removeChild(this.hintStoneDrawables[AppStone.BLACK].getView());
        this.view.removeChild(this.hintStoneDrawables[AppStone.WHITE].getView());
    }

    hintStone(color: AppStoneColor, pos: Coordinate) {
        if (!this.stoneHintAllowed) {
            return;
        }

        if (this.rule.isPlaced(pos)) {
            this.eraseStoneHint();
            return;
        }

        this.eraseStoneHint();
        const realPos = this.getDrawPosition(pos.x, pos.y);
        const stone = this.hintStoneDrawables[color];
        stone.setPosition(realPos);
        this.view.addChild(this.hintStoneDrawables[color].getView());
    }

    createStone(color: AppStoneColor, forHint?: boolean): AppStone {
        // @TODO change stone size based on board size
        return new AppStone(30, color, forHint);
    }

    showStoneHint() {
        this.stoneHintAllowed = true;
    }

    hideStoneHint() {
        this.stoneHintAllowed = false;
        this.eraseStoneHint();
    }

    placeStone(color: AppStoneColor, pos: Coordinate): boolean {
        const idx = pos.x + pos.y * this.size;

        if (this.rule.placeStone(color, pos)) {
            const stone = this.createStone(color);
            stone.setPosition(this.getDrawPosition(pos));
            this.placedStones.push({ pos, stone });
            this.view.addChild(stone.getView());

            return true;
        }

        return false;
    }
}
