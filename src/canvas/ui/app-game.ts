import { Coordinate, DefaultOmokRule, GameStatus, OmokRule, StoneColor } from '../../common';
import { AppEventManager, AppOptions, AppServerManager, defaultAppOptions } from '../core';
import { AppAIPlayer, AppPlayer, AppUserPlayer } from '../player';
import { AppBoard } from './app-board';
import { AppCanvas } from './app-canvas';
import { AppUx } from './app-ux';

export class AppGame {
    private _canvas: AppCanvas;
    private _board: AppBoard;
    private _ux: AppUx;

    public readonly canvasWidth = 1000;
    public readonly canvasHeight = 680;
    public readonly boardWidth = 680;
    public readonly boardHeight = 680;
    public readonly uxCanvasWidth = 320;
    public readonly uxCanvasHeight = 680;
    public readonly popupMargin = 40;

    private _event: AppEventManager;
    private _server: AppServerManager;
    private _omokRule: OmokRule;
    private _gameStatus: GameStatus = GameStatus.STOPPED;
    private _turn: StoneColor;
    private _gameTokenId: number;

    get canvas() {
        return this._canvas;
    }

    get board() {
        return this._board;
    }

    get event() {
        return this._event;
    }

    get server() {
        return this._server;
    }

    get omokRule() {
        return this._omokRule;
    }

    get gameStatus() {
        return this._gameStatus;
    }

    get turn() {
        return this._turn;
    }

    get gameTokenId() {
        return this._gameTokenId;
    }

    private players: {
        [key in StoneColor]?: AppPlayer
    } = {};

    private appInitialized: boolean = false;

    constructor(private container: HTMLElement, private appOptions: AppOptions = defaultAppOptions) {
        this._server = new AppServerManager(appOptions.serverOptions.host, appOptions.serverOptions.port);
        this._event = new AppEventManager();
    }

    async init() {
        this._canvas = new AppCanvas(this, this.canvasWidth, this.canvasHeight);
        await this._canvas.init();

        this._omokRule = new DefaultOmokRule();
        this._board = new AppBoard(this, this.boardWidth, this.boardHeight);
        this._canvas.addDrawable(this._board);

        this._ux = new AppUx(this);
        this._canvas.addDrawable(this._ux);

        this._gameTokenId = 0;
        this.initEvnetListeners();

        this.players = {};

        // Server Connection
        await this._server.connect();
        console.log('Server Connected');

        this._event.playerChanged.emit({
            color: StoneColor.BLACK,
            player: new AppUserPlayer(this, StoneColor.BLACK)
        });
        this._event.playerChanged.emit({
            color: StoneColor.WHITE,
            player: new AppUserPlayer(this, StoneColor.WHITE)
        });

        // Initialized
        this.appInitialized = true;

        // Add to view
        this.container.appendChild(this._canvas.getView());
    }

    async initGame() {
        if (this._gameStatus !== GameStatus.STOPPED) {
            return Promise.reject('Game is playing');
        }

        this._gameStatus = GameStatus.INITIALIZING;
        this._turn = StoneColor.BLACK;
        this._board.clearBoard();
        await this._server.initGame({
            players: {
                [StoneColor.BLACK]: this.players[StoneColor.BLACK].getName(),
                [StoneColor.WHITE]: this.players[StoneColor.WHITE].getName()
            }
        });
        this._gameStatus = GameStatus.INITIALIZED;
    }

    async startGame() {
        if (this._gameStatus !== GameStatus.INITIALIZED) {
            return;
        }

        this._gameStatus = GameStatus.PLAYING;
        this.changeTurn(true);
        await this._server.startGame();
        this.gameProcess(this._gameTokenId);
    }

    async stopGame() {
        if (this._gameStatus === GameStatus.STOPPED) {
            return Promise.resolve();
        }

        this._gameStatus = GameStatus.STOPPING;
        await this._server.stopGame();
        this._gameTokenId++;
        this._gameStatus = GameStatus.STOPPED;
    }

    async gameProcess(gameTokenId: number) {
        let pos = new Coordinate(-1, -1);

        while (gameTokenId === this._gameTokenId && this._gameStatus === GameStatus.PLAYING) {
            pos = await this.players[this._turn].getNextPlace(pos);
            await this.placeStone(pos);
        }
    }

    private changeTurn(init: boolean = false) {
        if (init) {
            this._event.turnChanged.emit(StoneColor.BLACK);
            return;
        }

        if (this._turn == StoneColor.BLACK) {
            this._event.turnChanged.emit(StoneColor.WHITE);
        } else {
            this._event.turnChanged.emit(StoneColor.BLACK);
        }
    }

    private async placeStone(pos: Coordinate) {
        try {
            const res = await this._server.placeStone(this._turn, pos);
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

        if (this._board.placeStone(this._turn, pos)) {
            this.changeTurn();
        }
    }

    private initEvnetListeners() {
        this._event.gameStarted.on(() => {
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

        this._event.gameEnded.on(() => {
            this.stopGame();
        });

        this._event.turnChanged.on((turn: StoneColor) => {
            this._turn = turn;
        });

        this._event.playerChanged.on((data) => {
            this.players[data.color] = data.player;
        });
    }

    changePlayer(color: StoneColor, playerType: 'user' | 'ai') {
        // TODO
        const player = playerType === 'user' ? new AppUserPlayer(this, color) : new AppAIPlayer(this, color);
        this.event.gameEnded.emit();
        this._event.playerChanged.emit({ color, player });
    }
}
