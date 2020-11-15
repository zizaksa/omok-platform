import { Coordinate, StoneColor } from '../../common';
import { AppPlayer } from './app-player';

export class AppAIPlayer extends AppPlayer {
    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        pos = await this.game.server.getNextPlace(this.color, pos);
        
        return pos;
    }

    getName(): string {
        return 'run';
    }
}
