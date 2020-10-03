import * as io from 'socket.io-client';
import { Coordinate } from '../../common/coordinate';
import { MSG_PLACE_STONE } from '../../common/messages';

export class AppServerManager {
    private socket: SocketIOClient.Socket;

    constructor(private host: string, private port: number) {

    }

    connect(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.socket = io.connect(`http://${this.host}:${this.port}`);
            this.socket.once('connect', () => {
                resolve();
            });
        });
    }

    placeStone(pos: Coordinate): Promise<Coordinate> {
        return this.sendAndWaitResponse(MSG_PLACE_STONE, pos);
    }

    sendAndWaitResponse(msgName: string, data: any): Promise<any> {
        return new Promise((resolve, reject) => {
            this.socket.once(msgName, (res) => {
                resolve(res);
            });
            this.socket.emit(msgName, data);
        });
    }
}
