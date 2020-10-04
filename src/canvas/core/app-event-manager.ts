import { EventEmitter } from 'events';
import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { AppPlayer } from '../player/app-player';
import { AppEvent } from './app-event';

export class AppEventManager {
    public static instance: AppEventManager;

    private eventEmitter = new EventEmitter();

    readonly gameStarted = this.createEvent('GAME_STARTED');
    readonly gameEnded = this.createEvent('GAME_ENDED');
    readonly gridSelected = this.createEvent<Coordinate>('GRID_SELECTED');
    readonly turnChanged = this.createEvent<StoneColor>('TURN_CHANGED');
    readonly stonePlaced = this.createEvent<Coordinate>('STONE_PLACED');
    readonly playerChanged = this.createEvent<{ color: StoneColor, player: AppPlayer }>('PLAYER_CHANGED');

    private constructor() {}

    public static getInstance(): AppEventManager {
        if (!this.instance) {
            this.instance = new AppEventManager();
        }

        return this.instance;
    }
    
    private createEvent<T=void>(eventName: string): AppEvent<T> {
        return new AppEvent(eventName, this.eventEmitter);
    }
}
