import * as io from 'socket.io';
import * as fs from 'fs';
import * as path from 'path';
import { Coordinate } from '../common/coordinate';
import { DEFAULT_GAME_CONFIG, GameConfig } from '../common/game-config';
import { GameStatus } from '../common/game-status';
import { MSG_GET_AI_LIST, MSG_GET_NEXT_PLACE, MSG_INIT_GAME, MSG_PLACE_STONE, MSG_START_GAME, MSG_STOP_GAME } from '../common/messages';
import { DefaultOmokRule } from '../common/rules/default-omok-rule';
import { OmokRule } from '../common/rules/omok-rule';
import { getOpponent, StoneColor } from '../common/stone-color';
import { OmokAIPlayer, OmokPlayer, OmokUserPlayer } from './omok-player';
import { APP_CONFIG } from '../config';
import { pathToFileURL } from 'url';

export class OmokGame {
    private players: { [key in StoneColor]?: OmokPlayer } = {};
    private rule: OmokRule;

    private turn: StoneColor;
    private gameStatus: GameStatus;

    constructor(private socket: io.Socket) {
        this.beginHandleMessages();
    }

    private beginHandleMessages() {
        this.socket.on(MSG_INIT_GAME, (config: GameConfig) => {
            config = Object.assign({}, DEFAULT_GAME_CONFIG, config);

            if (!config.players[StoneColor.BLACK] || !config.players[StoneColor.WHITE]) {
                this.socket.emit(MSG_INIT_GAME, 'error', config);
                return;
            }

            this.rule = new DefaultOmokRule();
            
            this.gameStatus = GameStatus.STOPPED;

            [StoneColor.BLACK, StoneColor.WHITE].forEach((color) => {
                const name = config.players[color];
                if (name === 'user') {
                    this.players[color] = new OmokUserPlayer();
                } else {
                    this.players[color] = new OmokAIPlayer(name);
                }

                this.players[color].init();
            });

            this.initGame();

            Promise.resolve().then(() => {
                return this.players[StoneColor.BLACK].setColor(StoneColor.BLACK);
            }).then(() => {
                return this.players[StoneColor.WHITE].setColor(StoneColor.WHITE);
            }).then(() => {
                this.socket.emit(MSG_INIT_GAME, 'success');
            });
        });

        this.socket.on(MSG_START_GAME, () => {
            this.startGame();
            this.socket.emit(MSG_START_GAME, 'success');
        });

        this.socket.on(MSG_STOP_GAME, () => {
            this.stopGame();
            this.socket.emit(MSG_STOP_GAME, 'success');
        });

        this.socket.on(MSG_PLACE_STONE, (data: {color: StoneColor, pos: Coordinate }) => {
            const color = data.color;
            const pos = data.pos;

            if (this.gameStatus !== GameStatus.PLAYING) {
                this.socket.emit(MSG_PLACE_STONE, 'error', 'game is not started');
                return;
            }

            if (this.turn !== color) {
                this.socket.emit(MSG_PLACE_STONE, 'error', 'not your turn');
                return;
            }

            if (!this.rule.checkValidity(color, pos)) {
                this.socket.emit(MSG_PLACE_STONE, 'error', 'cannot place');
                return;
            }

            this.players[getOpponent(color)].placeStone(pos);
            this.rule.placeStone(color, pos);
            this.turn = getOpponent(this.turn);

            if (this.rule.isFinished()) {
                for (const color in this.players) {
                    this.players[color].endGame(color);
                }
                this.stopGame();
                this.socket.emit(MSG_PLACE_STONE, `win ${color == StoneColor.BLACK ? 'black' : 'white'}`);
            }

            this.socket.emit(MSG_PLACE_STONE, 'success');
        });

        this.socket.on(MSG_GET_NEXT_PLACE, (data: {color: StoneColor, pos: Coordinate }) => {
            const color = data.color;
            const pos = data.pos;

            if (this.players[color] instanceof OmokUserPlayer) {
                this.socket.emit(MSG_GET_NEXT_PLACE, 'error', 'the player is user');
                return;
            }

            const player = this.players[color] as OmokAIPlayer;
            player.getNextPlace(pos).then((nextPos) => {
                this.socket.emit(MSG_GET_NEXT_PLACE, nextPos);
            });
        });

        this.socket.on(MSG_GET_AI_LIST, () => {
            const list = fs.readdirSync(APP_CONFIG.AI_DIRPATH).filter(file => {
                // check if is executable
                if (process.platform === "win32") {
                    if (path.extname(file) === '.exe') {
                        return true;
                    }
                }

                try {
                    // Check if linux has execution rights
					const f = path.join(APP_CONFIG.AI_DIRPATH, file);
                    fs.accessSync(f, fs.constants.X_OK);
                    return true;
                } catch(ex) {
                }

                return false;
            }).map(ai => {
                return path.parse(ai).name;
            });

            this.socket.emit(MSG_GET_AI_LIST, list);
        });
    }

    destroy() {
        for (const color in this.players) {
            this.players[color].destroy();
        }
    }

    private initGame() {
        this.turn = StoneColor.BLACK;
        this.rule.init();
    }

    private startGame() {
        this.gameStatus = GameStatus.PLAYING;
    }

    private stopGame() {
        this.gameStatus = GameStatus.STOPPED;
        this.destroy();
    }
}
