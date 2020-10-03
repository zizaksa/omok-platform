import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppBoard } from '../ui/app-board';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    constructor(private color: StoneColor,
                private board: AppBoard) {
        super();
    }

    async changeTurn(pos: Coordinate): Promise<Coordinate> {
        this.board.enableInteraction(this.color);
        return await this.board.waitUesrSelection(true);
    }
}
