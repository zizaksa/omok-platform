import * as child from 'child_process';

export class ProgramRunner {
    private proc: child.ChildProcess;

    constructor(private path: string) {
        this.proc = null;
    }

    spawn() {
        if (!this.proc) {
            this.proc = child.fork(this.path, {
                stdio: ['pipe']
            });
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

    write(message: string) {
        if (this.proc) {
            this.proc.send(message);
        }
    }

    onReceive(callback: (string) => void) {
        this.proc.on('message', (message) => {
            callback(message);
        });
    }
}
