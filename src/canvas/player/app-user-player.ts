import { Coordinate, StoneColor } from '../../common';
import { AppServerManager } from '../core';
import { AppBoard, AppGame } from '../ui';
import { AppPlayer } from './app-player';

export class AppUserPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private server: AppServerManager,
                private board: AppBoard,
                private app: AppGame) {
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
