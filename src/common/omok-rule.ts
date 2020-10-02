import { AppStoneColor } from "../canvas/ui/app-stone";
import { Coordinate } from "./coordinate";

export abstract class OmokRule {
    abstract init();
    abstract isPlaced(pos: Coordinate): boolean;
    abstract canBePlaced(turn: AppStoneColor, pos: Coordinate): boolean;
    abstract placeStone(turn: AppStoneColor, pos: Coordinate): boolean;
}
