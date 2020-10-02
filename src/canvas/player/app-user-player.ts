import { Coordinate } from "../../common/coordinate";
import { AppBoard } from "../ui/app-board";
import { AppStoneColor } from "../ui/app-stone";
import { AppPlayer } from "./app-player";

export class AppUserPlayer extends AppPlayer {
    constructor(private color: AppStoneColor,
                private board: AppBoard) {
        super();
    }

    async changeTurn(pos: Coordinate): Promise<Coordinate> {
        return await this.board.enableInteraction(this.color);
    }
}
