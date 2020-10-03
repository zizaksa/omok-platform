import { Coordinate } from './coordinate';
import { StoneColor } from './stone-color';

export abstract class OmokRule {
    abstract init();
    abstract isPlaced(pos: Coordinate): boolean;
    abstract canBePlaced(turn: StoneColor, pos: Coordinate): boolean;
    abstract placeStone(turn: StoneColor, pos: Coordinate): boolean;
}
