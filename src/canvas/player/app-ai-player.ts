import { Coordinate } from "../../common/coordinate";
import { MSG_CLI_PLACE_STONE, MSG_SRV_PLACE_STONE } from "../../common/messages";
import { AppBoard } from "../ui/app-board";
import { AppStoneColor } from "../ui/app-stone";
import { AppPlayer } from "./app-player";

export class AppAIPlayer extends AppPlayer {
    constructor(private color: AppStoneColor,
                private socket: SocketIOClient.Socket) {
        super();
    }

    changeTurn(pos: Coordinate): Promise<Coordinate> {
        return new Promise((resolve, reject) => {
            console.log('send data', pos);
            this.socket.emit(MSG_SRV_PLACE_STONE, pos.x, pos.y);
            this.socket.once(MSG_CLI_PLACE_STONE, (pos) => {
                resolve(pos);
            });
        });
    }
}
