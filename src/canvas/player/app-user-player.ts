import { Coordinate, StoneColor } from '../../common';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        this.game.board.enableInteraction(this.color);
        pos = await this.game.board.waitUesrSelection(true);
        return pos;
    }

    getName(): string {
        return 'user';
    }
}
