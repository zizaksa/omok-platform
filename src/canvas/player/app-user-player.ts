import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppServerManager } from '../core/app-server-manager';
import { AppBoard } from '../ui/app-board';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private server: AppServerManager,
                private board: AppBoard) {
        super(color);
    }

    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        this.board.enableInteraction(this.color);
        pos = await this.board.waitUesrSelection(true);
        return pos;
    }

    getName(): string {
        return 'user';
    }
}
