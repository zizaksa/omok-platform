import { Coordinate, DefaultOmokRule, GameStatus, OmokRule, StoneColor } from '../../common';
import { AppEventManager, AppOptions, AppServerManager, defaultAppOptions } from '../core';
import { AppAIPlayer, AppPlayer, AppUserPlayer } from '../player';
import { AppBoard } from './app-board';
import { AppCanvas } from './app-canvas';
import { AppUx } from './app-ux';

export class AppGame {
    private canvas: AppCanvas;
    private board: AppBoard;
    private ux: AppUx;

    private canvasWidth = 1000;
    private canvasHeight = 680;
    private boardWidth = 680;
    private boardHeight = 680;
    private uxCanvasWidth = 320;
    private uxCanvasHeight = 680;

    private event: AppEventManager;
    private server: AppServerManager;
    private omokRule: OmokRule;
    private gameStatus: GameStatus = GameStatus.STOPPED;
    private turn: StoneColor;
    private gameTokenId: number;

    private players: {
        [key in StoneColor]?: AppPlayer
    } = {};

    private appInitialized: boolean = false;

    constructor(private container: HTMLElement, private appOptions: AppOptions = defaultAppOptions) {
        this.server = new AppServerManager(appOptions.serverOptions.host, appOptions.serverOptions.port);
        this.event = AppEventManager.getInstance();
    }

    async init() {
        this.canvas = new AppCanvas(this.canvasWidth, this.canvasHeight);
        await this.canvas.init();

        this.omokRule = new DefaultOmokRule();
        this.board = new AppBoard(this.boardWidth, this.boardHeight, this.omokRule);
        this.canvas.addDrawable(this.board);

        this.ux = new AppUx(this.uxCanvasWidth, this.uxCanvasHeight);
        this.ux.getView().x = this.boardWidth;
        this.canvas.addDrawable(this.ux);

        this.gameTokenId = 0;
        this.initEvnetListeners();

        this.players = {};
        // [StoneColor.BLACK]: new AppAIPlayer(StoneColor.BLACK, this.server),
        // [StoneColor.BLACK]: new AppUserPlayer(StoneColor.BLACK, this.board, this.server),
        // [StoneColor.WHITE]: new AppAIPlayer(StoneColor.WHITE, this.server),
        // [StoneColor.WHITE]: new AppUserPlayer(StoneColor.WHITE, this.board)

        // Server Connection
        await this.server.connect();
        console.log('Server Connected');

        this.event.playerChanged.emit({
            color: StoneColor.BLACK,
            player: new AppAIPlayer(StoneColor.BLACK, this.server)
        });
        this.event.playerChanged.emit({
            color: StoneColor.WHITE,
            // player: new AppUserPlayer(StoneColor.WHITE, this.server, this.board)
            player: new AppUserPlayer(StoneColor.WHITE, this.server, this.board, this)
        });

        // Initialized
        this.appInitialized = true;

        // Add to view
        this.container.appendChild(this.canvas.getView());
    }

    async initGame() {
        if (this.gameStatus !== GameStatus.STOPPED) {
            return Promise.reject('Game is playing');
        }

        this.gameStatus = GameStatus.INITIALIZING;
        this.turn = StoneColor.BLACK;
        this.board.clearBoard();
        await this.server.initGame({
            players: {
                [StoneColor.BLACK]: this.players[StoneColor.BLACK].getName(),
                [StoneColor.WHITE]: this.players[StoneColor.WHITE].getName()
            }
        });
        this.gameStatus = GameStatus.INITIALIZED;
    }

    async startGame() {
        if (this.gameStatus !== GameStatus.INITIALIZED) {
            return;
        }

        this.gameStatus = GameStatus.PLAYING;
        this.changeTurn(true);
        await this.server.startGame();
        this.gameProcess(this.gameTokenId);
    }

    async stopGame() {
        if (this.gameStatus === GameStatus.STOPPED) {
            return Promise.resolve();
        }

        this.gameStatus = GameStatus.STOPPING;
        await this.server.stopGame();
        this.gameTokenId++;
        this.gameStatus = GameStatus.STOPPED;
    }

    async gameProcess(gameTokenId: number) {
        let pos = new Coordinate(-1, -1);

        while (gameTokenId === this.gameTokenId && this.gameStatus === GameStatus.PLAYING) {
            pos = await this.players[this.turn].getNextPlace(pos);
            await this.placeStone(pos);
        }
    }

    private changeTurn(init: boolean = false) {
        if (init) {
            this.event.turnChanged.emit(StoneColor.BLACK);
            return;
        }

        if (this.turn == StoneColor.BLACK) {
            this.event.turnChanged.emit(StoneColor.WHITE);
        } else {
            this.event.turnChanged.emit(StoneColor.BLACK);
        }
    }

    private async placeStone(pos: Coordinate) {
        try {
            const res = await this.server.placeStone(this.turn, pos);
            if (typeof res === 'string') {
                if (res.indexOf('win') >= 0) {
                    console.log('winner', '');
                    this.stopGame();
                }
            }
        } catch(e) {
            console.log(e);
            this.stopGame();
        }

        if (this.board.placeStone(this.turn, pos)) {
            this.changeTurn();
        }
    }

    private initEvnetListeners() {
        this.event.gameStarted.on(() => {
            Promise.resolve().then(() => {
                return this.stopGame();
            }).then(() => {
                return this.initGame();
            }).then(() => {
                this.startGame();
                console.log('Game Started!');
            }).catch(e => {
                console.log(e);
            });
        });

        this.event.gameEnded.on(() => {
            this.stopGame();
        });

        this.event.turnChanged.on((turn: StoneColor) => {
            this.turn = turn;
        });

        this.event.playerChanged.on((data) => {
            this.players[data.color] = data.player;
        });
    }
}
