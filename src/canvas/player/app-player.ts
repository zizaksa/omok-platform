import { Coordinate, StoneColor } from "../../common";
import { AppGame } from "../ui";

export abstract class AppPlayer {
    constructor(protected game: AppGame, protected color: StoneColor) {
        this.color = color;
    }

    abstract getNextPlace(pos: Coordinate): Promise<Coordinate>;
    
    abstract getName(): string;

    getColor(): StoneColor {
        return this.color;
    }
}
