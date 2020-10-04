import { Coordinate } from '../coordinate';
import { StoneColor } from '../stone-color';

export abstract class OmokRule {
    abstract init();
    abstract getStoneColor(pos: Coordinate): StoneColor | null;
    abstract checkValidity(turn: StoneColor, pos: Coordinate): boolean;
    abstract placeStone(turn: StoneColor, pos: Coordinate): void;
    abstract isFinished(): boolean;
}
