import { Coordinate } from '../../common/coordinate';

export abstract class AppPlayer {
    abstract changeTurn(pos: Coordinate): Promise<Coordinate>;
}
