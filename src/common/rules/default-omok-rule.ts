import { Coordinate } from '../coordinate';
import { OmokRule } from './omok-rule';
import { StoneColor } from '../stone-color';

export class DefaultOmokRule extends OmokRule {
    private size: number;
    private stoneInfo: number[];

    private dx = [-1, 0, 1, 0];
    private dy = [];

    private lastPlaced: Coordinate;

    private remains: number;

    constructor(size: number = 19) {
        super();
        this.size = size;
        this.stoneInfo = Array(size * size).fill(0);
    }

    init() {
        this.stoneInfo = this.stoneInfo.map(() => 0);
        this.remains = this.size * this.size;
    }

    getStoneColor(pos: Coordinate): StoneColor | null {
        if (this.stoneInfo[pos.x + pos.y * this.size] === 0) {
            return null;
        }

        return this.stoneInfo[pos.x + pos.y * this.size] as StoneColor;
    }

    checkValidity(turn: StoneColor, pos: Coordinate): boolean {
        if (this.getStoneColor(pos) !== null) {
            return false;
        }

        return true;
    }

    placeStone(turn: StoneColor, pos: Coordinate) {
        if (!this.checkValidity(turn, pos)) {
            return;
        }

        this.stoneInfo[pos.x + pos.y * this.size] = turn === StoneColor.BLACK ? 1 : 2;
        this.lastPlaced = new Coordinate(pos.x, pos.y);
        this.remains--;
    }

    isFinished(): boolean {
        return this.remains === 0;
    }
}