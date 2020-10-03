import { Coordinate } from '../coordinate';
import { OmokRule } from '../omok-rule';
import { StoneColor } from '../stone-color';

export class DefaultOmokRule extends OmokRule {
    private size: number;

    private stoneInfo: number[];

    constructor(size: number = 19) {
        super();
        this.size = size;
        this.stoneInfo = Array(size * size).fill(0);
    }

    init() {
        this.stoneInfo = this.stoneInfo.map(() => 0);
    }

    isPlaced(pos: Coordinate): boolean {
        if (this.stoneInfo[pos.x + pos.y * this.size] === 0) {
            return false;
        }
        return true;
    }

    canBePlaced(turn: StoneColor, pos: Coordinate): boolean {
        if (this.isPlaced(pos)) {
            return false;
        }

        return true;
    }

    placeStone(turn: StoneColor, pos: Coordinate): boolean {
        if (!this.canBePlaced(turn, pos)) {
            return false;
        }

        this.stoneInfo[pos.x + pos.y * this.size] = turn === StoneColor.BLACK ? 1 : 2;
        return true;
    }
}