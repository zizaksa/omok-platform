import { AppBoard } from "./app-board";
import { AppCanvas } from "./app-canvas";
import { AppStone, AppStoneColor } from "./app-stone";
import * as io from 'socket.io-client';
import { Coordinate } from "../../common/coordinate";
import { APP_CONFIG } from "../../config";
import { DefaultOmokRule } from "../../common/rules/default-omok-rule";
import { AppUx } from "./app-ux";
import { AppPlayer } from "../player/app-player";
import { AppAIPlayer } from "../player/app-ai-player";
import { AppUserPlayer } from "../player/app-user-player";
import { MSG_SRV_PLACE_STONE } from "../../common/messages";

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

    private players: {
        [key in AppStoneColor]: AppPlayer
    };

    private gameStatus = 'PLAYING';

    constructor(private container: HTMLElement) {
        this.socket = io.connect(`http://${APP_CONFIG.SERVER_HOST}:${APP_CONFIG.SERVER_PORT}`);
    }

    async init() {
        this.canvas = new AppCanvas(this.canvasWidth, this.canvasHeight);
        await this.canvas.init();

        /*
        this.canvas.onMouseMove((x: number, y: number) => {
            this.onMouseMove(x, y);
        });

        this.canvas.onMouseClick((x: number, y: number) => {
            this.onMouseClick(x, y);
        });
        */

        this.container.appendChild(this.canvas.getView());

        const omokRule = new DefaultOmokRule();
        this.board = new AppBoard(omokRule, this.boardWidth, this.boardHeight);
        this.canvas.addDrawable(this.board);

        this.socket.on('connect', () => {
            console.log('server connected');
        });

        const ux = new AppUx(this.uxCanvasWidth, this.uxCanvasHeight, this.board);
        ux.getView().x = this.boardWidth;
        ux.startGameButtonClicked.on('start', () => {
            this.startGame();
        });

        this.canvas.addDrawable(ux);

        this.players = {
            [AppStone.BLACK]: new AppAIPlayer(AppStone.BLACK, this.socket),
            [AppStone.WHITE]: new AppUserPlayer(AppStone.WHITE, this.board)
        };

        setInterval(() => {
            this.socket.emit('haha');
        }, 1000)
    }

    /*
    private onMouseMove(x: number, y: number) {
        const gridPos = this.board.getGridPosition(x, y);

        if (gridPos.x < 0) {
            this.board.eraseStoneHint();
        } else {
            this.board.hintStone(this.turn, gridPos);
        }
    }
    */

    startGame() {
        this.gameProcess();
    }

    async gameProcess() {
        let pos = new Coordinate(-1, -1);

        console.log(this.players);
        while (this.gameStatus === 'PLAYING') {
            pos = await this.players[this.turn].changeTurn(pos);
            this.placeStone(pos);
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
            this.socket.emit(MSG_SRV_PLACE_STONE, gridPos.x, gridPos.y);
        }
    }
}
