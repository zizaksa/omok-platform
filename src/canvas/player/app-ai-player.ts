import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppServerManager } from '../core/app-server-manager';
import { AppPlayer } from './app-player';

export class AppAIPlayer extends AppPlayer {
    constructor(color: StoneColor,
                private server: AppServerManager) {
        super(color);
    }

    changeTurn(pos: Coordinate): Promise<Coordinate> {
        return this.server.placeStone(pos);
    }

    getName(): string {
        return 'AI 플레이어';
    }
}
