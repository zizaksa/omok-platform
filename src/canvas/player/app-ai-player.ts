import { Coordinate, StoneColor } from '../../common';
import { AppPlayer } from './app-player';

export class AppAIPlayer extends AppPlayer {
    private aiName: string;

    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        pos = await this.game.server.getNextPlace(this.color, pos);
        
        return pos;
    }

    select(name: string) {
        this.aiName = name;
        return this;
    }

    getName(): string {
        return this.aiName;
    }
}
