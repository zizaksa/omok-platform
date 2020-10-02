import * as child from 'child_process';

export class ProgramRunner {
    private proc: child.ChildProcess;

    constructor(private path: string) {
        this.proc = null;
    }

    spawn() {
        if (!this.proc) {
            this.proc = child.spawn(this.path);
            this.proc.on('end', () => {
                this.proc = null;
            });
        }
    }

    kill() {
        if (this.proc) {
            this.proc.kill();
            this.proc = null;
        }
    }

    send(message: string): Promise<string> {
        return new Promise((resolve, reject) => {
            this.proc.stdin.write(`${message}\n`);
            this.proc.stdout.once('data', (data) => {
                resolve(data.toString());
            });
        });
    }
}
