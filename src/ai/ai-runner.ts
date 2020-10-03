import { Coordinate } from '../common/coordinate';
import { ProgramRunner } from './program-runner';

export class AIRunner {
    private runner: ProgramRunner;

    constructor(private path: string) {
        this.runner = new ProgramRunner(path);
        this.runner.spawn();
    }

    async setColor(color: number): Promise<boolean> {
        await this.runner.send(color.toString());

        return true;
    }

    async placeStone(pos: Coordinate): Promise<Coordinate> {
        const msg = await this.runner.send(`1\n${pos.x} ${pos.y}`);
        const data = msg.split(' ');

        return new Coordinate(parseInt(data[0]), parseInt(data[1]));
    }

    kill() {
        this.runner.kill();
    }
}
