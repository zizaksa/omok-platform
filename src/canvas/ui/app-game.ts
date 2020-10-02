import { AppBoard } from "./app-board";
import { AppCanvas } from "./app-canvas";
import { AppStone, AppStoneColor } from "./app-stone";
import * as io from 'socket.io-client';
import { Coordinate } from "../../common/coordinate";
import { APP_CONFIG } from "../../config";
import { DefaultOmokRule } from "../../common/rules/default-omok-rule";
import { AppUx } from "./app-ux";
import { MSG_PLACE_STONE } from "../../common/messages";

export class AppGame {
    private canvas: AppCanvas;
    private board: AppBoard;

    private canvasWidth = 1000;
    private canvasHeight = 680;
    private boardWidth = 680;
    private boardHeight = 680;
    private uxCanvasWidth = 320;
    private uxCanvasHeight = 680;

    private turn: AppStoneColor = AppStone.BLACK;

    private socket: SocketIOClient.Socket;

    constructor(private container: HTMLElement) {
        this.socket = io.connect(`http://${APP_CONFIG.SERVER_HOST}:${APP_CONFIG.SERVER_PORT}`);
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

        const omokRule = new DefaultOmokRule();
        this.board = new AppBoard(omokRule, this.boardWidth, this.boardHeight);
        this.canvas.addDrawable(this.board);

        this.socket.on('connect', () => {
            console.log('server connected');
        });

        this.socket.on(MSG_PLACE_STONE, (x: number, y: number) => {
            this.placeStone(new Coordinate(x, y));
        });

        const ux = new AppUx(this.uxCanvasWidth, this.uxCanvasHeight, this.board);
        ux.getView().x = this.boardWidth;
        this.canvas.addDrawable(ux);
    }

    private onMouseMove(x: number, y: number) {
        const gridPos = this.board.getGridPosition(x, y);

        if (gridPos.x < 0) {
            this.board.eraseStoneHint();
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
            this.socket.emit(MSG_PLACE_STONE, gridPos.x, gridPos.y);
        }
    }
}
