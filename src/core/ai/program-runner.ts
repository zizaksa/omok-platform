import * as child from 'child_process';

export class ProgramRunner {
    private proc: child.ChildProcess;

    constructor(private path: string) {
        this.proc = null;
    }

    spawn() {
        if (!this.proc) {
            this.proc = child.spawn(this.path);
            this.proc.on('exit', () => {
                this.proc = null;
            });
        }
    }

    kill() {
        if (this.isAlive()) {
            this.proc.kill();
            this.proc = null;
        }
    }

    on(event: string, listener: (...args: any[]) => void) {
        if (this.isAlive()) {
            this.proc.on(event, listener);
        }
    }

    send(message: string): Promise<boolean> {
        if (this.isAlive()) {
            if (this.proc.stdin.write(`${message}\n`)) {
                return Promise.resolve(true);
            } else {
                return Promise.reject('Failed to write message');
            }
        }

        return Promise.reject('Process is not running');
    }

    sendAndWait(message: string): Promise<string> {
        if (this.isAlive()) {
            return new Promise((resolve, reject) => {
                this.proc.stdin.write(`${message}\n`);
                this.proc.stdout.once('data', (data) => {
                    resolve(data.toString());
                });
            });
        } else {
            return Promise.reject('Process is not running');
        }
    }

    isAlive(): boolean {
        return this.proc && !this.proc.exitCode;
    }
}
