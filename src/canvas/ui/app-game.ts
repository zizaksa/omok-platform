import { AppBoard } from './app-board';
import { AppCanvas } from './app-canvas';
import { Coordinate } from '../../common/coordinate';
import { DefaultOmokRule } from '../../common/rules/default-omok-rule';
import { AppUx } from './app-ux';
import { AppPlayer } from '../player/app-player';
import { AppAIPlayer } from '../player/app-ai-player';
import { AppUserPlayer } from '../player/app-user-player';
import { StoneColor } from '../../common/stone-color';
import { GameStauts } from '../../common/game-status';
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
    private gameStatus: GameStauts;
    private turn: StoneColor;
    private gameTokenId: number;

    private players: {
        [key in StoneColor]: AppPlayer
    };

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

        this.players = {
            [StoneColor.BLACK]: new AppUserPlayer(StoneColor.BLACK, this.board),
            [StoneColor.WHITE]: new AppUserPlayer(StoneColor.WHITE, this.board)
        };

        // Server Connection
        await this.server.connect();
        console.log('Server Connected');

        this.appInitialized = true;
        this.container.appendChild(this.canvas.getView());
    }

    initGame() {
        this.turn = StoneColor.BLACK;
        this.gameStatus = GameStauts.WAITING;
    }

    startGame() {
        this.gameStatus = GameStauts.PLAYING;
        this.gameProcess(this.gameTokenId);
    }

    stopGame() {
        this.gameTokenId++;
        this.gameStatus = GameStauts.WAITING;
    }

    async gameProcess(gameTokenId: number) {
        let pos = new Coordinate(-1, -1);

        console.log(this.players);
        while (gameTokenId === this.gameTokenId && this.gameStatus === GameStauts.PLAYING) {
            pos = await this.players[this.turn].changeTurn(pos);
            this.placeStone(pos);
        }
    }

    private changeTurn() {
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
        this.event.gameStart.on(() => {
            this.stopGame();
            this.initGame();
            this.startGame();
        });

        this.event.turnChanged.on((turn: StoneColor) => {
            this.turn = turn;
        });
    }
}
