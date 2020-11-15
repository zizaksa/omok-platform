import { Coordinate, StoneColor } from '../../common';
import { AppServerManager } from '../core';
import { AppPlayer } from './app-player';

export class AppAIPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private server: AppServerManager) {
        super(color);
    }

    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        pos = await this.server.getNextPlace(this.color, pos);
        
        return pos;
    }

    getName(): string {
        return 'run';
    }
}
