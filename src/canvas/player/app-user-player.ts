import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppBoard } from '../ui/app-board';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private board: AppBoard) {
        super(color);
    }

    async changeTurn(pos: Coordinate): Promise<Coordinate> {
        this.board.enableInteraction(this.color);
        return await this.board.waitUesrSelection(true);
    }

    getName(): string {
        return '플레이어';
    }
}
