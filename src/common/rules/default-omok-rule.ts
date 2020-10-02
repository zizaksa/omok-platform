import { AppStone, AppStoneColor } from "../../canvas/ui/app-stone";
import { Coordinate } from "../coordinate";
import { OmokRule } from "../omok-rule";

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

    canBePlaced(turn: AppStoneColor, pos: Coordinate): boolean {
        if (this.isPlaced(pos)) {
            return false;
        }

        return true;
    }

    placeStone(turn: AppStoneColor, pos: Coordinate): boolean {
        if (!this.canBePlaced(turn, pos)) {
            return false;
        }

        this.stoneInfo[pos.x + pos.y * this.size] = turn === AppStone.BLACK ? 1 : 2;
        return true;
    }
}