import * as io from 'socket.io-client';
import { Coordinate, GameConfig, MSG_GET_AI_LIST, MSG_GET_NEXT_PLACE, MSG_INIT_GAME, MSG_PLACE_STONE, MSG_START_GAME, MSG_STOP_GAME, StoneColor } from '../../common';

export class AppServerManager {
    private socket: SocketIOClient.Socket;

    constructor(private host: string, private port: number) {

    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
			if (this.port === 80) {
            	this.socket = io.connect(`${this.host}`);
			} else {
            	this.socket = io.connect(`${this.host}:${this.port}`);
			}
            this.socket.once('connect', () => {
                resolve();
            });
        });
    }

    placeStone(color: StoneColor, pos: Coordinate): Promise<Coordinate | string> {
        return this.sendAndWaitResponse(MSG_PLACE_STONE, { color, pos });
    }

    getNextPlace(color: StoneColor, pos: Coordinate): Promise<Coordinate> {
        return this.sendAndWaitResponse(MSG_GET_NEXT_PLACE, { color, pos });
    }

    initGame(config: GameConfig): Promise<string> {
        return this.sendAndWaitResponse(MSG_INIT_GAME, config);
    }

    startGame(): Promise<string> {
        return this.sendAndWaitResponse(MSG_START_GAME);
    }

    stopGame(): Promise<string> {
        return this.sendAndWaitResponse(MSG_STOP_GAME);
    }

    getAIList(): Promise<string[]> {
        return this.sendAndWaitResponse(MSG_GET_AI_LIST);
    }

    sendAndWaitResponse(msgName: string, data?: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.once(msgName, (res, errMsg) => {
                if (res === 'error') {
                    reject(errMsg);
                } else {
                    resolve(res);
                }
            });
            this.socket.emit(msgName, data);
        });
    }
}
