import { ProgramRunner } from "./program-runner";

export class AIRunner {
    private runner: ProgramRunner;

    constructor(private path: string) {
        this.runner = new ProgramRunner(path);
        this.runner.spawn();
    }

    setColor(color: number) {
        this.runner.write(color.toString());
    }

    onStonePlaced(callback: (x: number, y: number) => void) {
        this.runner.onReceive((message) => {
            if (/\d+ \d+/.test(message)) {
                const msg = message.split(' ');
                const x = parseInt(msg[0]);
                const y = parseInt(msg[1]);

                callback(x, y);
            }
        });
    }

    placeStone(x: number, y: number) {
        this.runner.write(`${x} ${y}`);
    }
}
