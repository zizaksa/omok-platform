import { Coordinate } from '../coordinate';
import { OmokRule } from './omok-rule';
import { StoneColor } from '../stone-color';

export class DefaultOmokRule extends OmokRule {
    private size: number;
    private stoneInfo: number[];

    private dx = [-1, 0, 1, 0];
    private dy = [];

    private lastPlaced: Coordinate;
    private lastTurn: StoneColor;

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
        this.lastTurn = turn;
        this.remains--;
    }

    isFinished(): boolean {
        let x = this.lastPlaced.x, y = this.lastPlaced.y;
        const dx = [ -1, -1, 0, 1 ];
        const dy = [ 0, -1, -1, -1 ];

        for (let i = 0; i < dx.length; i++) {
            if (this.countStones(this.lastTurn, x, y, dx[i], dy[i]) === 5) {
                return true;
            }
        }

        return this.remains === 0;
    }

    private countStones(color: StoneColor, sx: number, sy: number, dx: number, dy: number): number {
        let cnt = 0;
        let x = sx, y = sy;
        do {
            if (this.stoneInfo[x + y * this.size] === color) {
                cnt++;
            } else {
                break;
            }
            x -= dx, y -= dy;
        } while (0 <= x && x < this.size && 0 <= y && y < this.size);

        x = sx + dx, y = sy + dy;
        do {
            if (this.stoneInfo[x + y * this.size] === color) {
                cnt++;
            } else {
                break;
            }
            x += dx, y += dy;
        } while (0 <= x && x < this.size && 0 <= y && y < this.size);

        return cnt;
    }
}