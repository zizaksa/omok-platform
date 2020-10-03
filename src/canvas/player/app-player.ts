import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';

export abstract class AppPlayer {
    protected color: StoneColor;

    constructor(color: StoneColor) {
        this.color = color;
    }

    abstract changeTurn(pos: Coordinate): Promise<Coordinate>;
    
    abstract getName(): string;

    getColor(): StoneColor {
        return this.color;
    }
}
