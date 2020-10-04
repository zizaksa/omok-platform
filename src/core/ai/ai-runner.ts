import { Coordinate } from '../../common/coordinate';
import { StoneColor } from '../../common/stone-color';
import { ProgramRunner } from './program-runner';

export class AIRunner {
    private runner: ProgramRunner;

    constructor(private path: string) {
        this.runner = new ProgramRunner(path);
    }

    spawn() {
        this.runner.spawn();
    }

    async sendColor(color: number): Promise<boolean> {
        await this.runner.sendAndWait(color.toString());

        return true;
    }

    async sendPos(pos: Coordinate): Promise<Coordinate> {
        const msg = await this.runner.sendAndWait(`1\n${pos.x} ${pos.y}`);
        const data = msg.split(' ');

        return new Coordinate(parseInt(data[0]), parseInt(data[1]));
    }

    async sendGameSet(isWin: boolean): Promise<boolean> {
        return this.runner.send(`2\n${isWin ? '1' : '0'}`);
    }

    kill() {
        this.runner.kill();
    }

    static getAIList(): string[] {
        return ['run'];
    }
}
