import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppServerManager } from '../core/app-server-manager';
import { AppPlayer } from './app-player';

export class AppAIPlayer extends AppPlayer {
    constructor(private color: StoneColor,
                private server: AppServerManager) {
        super();
    }

    changeTurn(pos: Coordinate): Promise<Coordinate> {
        return this.server.placeStone(pos);
    }
}
