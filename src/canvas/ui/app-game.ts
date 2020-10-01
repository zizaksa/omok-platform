import { AppBoard } from "./app-board";
import { AppCanvas } from "./app-canvas";
import { AppStone, AppStoneColor } from "./app-stone";
import * as io from 'socket.io-client';
import { Coordinate } from "../../common/coordinate";

export class AppGame {
    private container: HTMLElement;

    private canvas: AppCanvas;
    private board: AppBoard;

    private canvasWidth: number = 680;
    private canvasHeight: number = 680;
    private boardWidth: number = 680;
    private boardHeight: number = 680;

    private turn: AppStoneColor = AppStone.BLACK;

    private socket: SocketIOClient.Socket;

    constructor(container: HTMLElement) {
        this.container = container;
        this.socket = io.connect('http://127.0.0.1:8081');
    }

    async init() {
        this.canvas = new AppCanvas(this.canvasWidth, this.canvasHeight);
        await this.canvas.init();

        this.canvas.onMouseMove((x: number, y: number) => {
            this.onMouseMove(x, y);
        });

        this.canvas.onMouseClick((x: number, y: number) => {
            this.onMouseClick(x, y);
        });

        this.container.appendChild(this.canvas.getView());

        this.board = new AppBoard(this.boardWidth, this.boardHeight);
        this.canvas.addDrawable(this.board);

        this.socket.on('connect', () => {
            console.log('server connected');
        });

        this.socket.on('place stone', (x: number, y: number) => {
            this.placeStone(new Coordinate(x, y));
        });
    }

    private onMouseMove(x: number, y: number) {
        const gridPos = this.board.getGridPosition(x, y);

        if (gridPos.x < 0) {
            this.board.removeStoneHint();
        } else {
            this.board.hintStone(this.turn, gridPos);
        }
    }

    private changeTurn() {
        if (this.turn == AppStone.BLACK) {
            this.turn = AppStone.WHITE;
        } else {
            this.turn = AppStone.BLACK;
        }
    }

    private placeStone(pos: Coordinate) {
        if (this.board.placeStone(this.turn, pos)) {
            this.changeTurn();
        }
    }

    private onMouseClick(x: number, y: number) {
        const gridPos = this.board.getGridPosition(x, y);

        if (gridPos.x >= 0) {
            this.placeStone(gridPos);
        }
    }
}
