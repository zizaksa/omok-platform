import { AppBoard } from './app-board';
import { AppCanvas } from './app-canvas';
import { Coordinate } from '../../common/coordinate';
import { DefaultOmokRule } from '../../common/rules/default-omok-rule';
import { AppUx } from './app-ux';
import { AppPlayer } from '../player/app-player';
import { AppAIPlayer } from '../player/app-ai-player';
import { AppUserPlayer } from '../player/app-user-player';
import { StoneColor } from '../../common/stone-color';
import { GameStatus } from '../../common/game-status';
import { AppEventManager } from '../core/app-event-manager';
import { AppServerManager } from '../core/app-server-manager';
import { AppOptions, defaultAppOptions } from '../core/app-options';
import { OmokRule } from '../../common/omok-rule';

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
            player: new AppUserPlayer(StoneColor.BLACK, this.board, this.server)
        });
        this.event.playerChanged.emit({
            color: StoneColor.WHITE,
            player: new AppUserPlayer(StoneColor.WHITE, this.board, this.server)
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
            players: Object.values(this.players).map((p) => ({[p.getColor()]: p.getName()})) as any
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
            pos = await this.players[this.turn].changeTurn(pos);
            this.placeStone(pos);
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

    private placeStone(pos: Coordinate) {
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
            });
        });

        this.event.turnChanged.on((turn: StoneColor) => {
            this.turn = turn;
        });

        this.event.playerChanged.on((data) => {
            this.players[data.color] = data.player;
        });
    }
}
