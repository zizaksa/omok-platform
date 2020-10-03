import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppServerManager } from '../core/app-server-manager';
import { AppBoard } from '../ui/app-board';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private board: AppBoard,
                private server: AppServerManager) {
        super(color);
    }

    async changeTurn(pos: Coordinate): Promise<Coordinate> {
        this.board.enableInteraction(this.color);
        this.server.placeStone(pos);
        return await this.board.waitUesrSelection(true);
    }

    getName(): string {
        return '플레이어';
    }
}
