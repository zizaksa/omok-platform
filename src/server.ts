import * as http from 'http';
import * as readline from 'readline';
import * as io from 'socket.io';
import { AIRunner } from './ai/ai-runner';
import { Coordinate } from './common/coordinate';
import { MSG_CLI_PLACE_STONE, MSG_SRV_PLACE_STONE } from './common/messages';
import { APP_CONFIG } from './config';

export class OmokServer {
    private server: http.Server;
    private port: number;
    private socket: io.Server;

    private ai: AIRunner;

    constructor(port: number) {
        this.server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Server Running!');
            res.end();
        });
        this.port = port;

        this.ai = new AIRunner('./ai/run.exe');
    }

    async run() {
        this.server.listen(this.port);
        this.socket = io.listen(this.server);

        await this.ai.setColor(1);

        this.socket.on('connection', (client) => {
            console.log('connected');

            client.on(MSG_SRV_PLACE_STONE, (x, y) => {
                console.log('receive', x, y);
                this.ai.placeStone(new Coordinate(x, y)).then((pos) => {
                    this.socket.emit(MSG_CLI_PLACE_STONE, pos);
                });
            });
        });
    }

    placeStone(pos: Coordinate) {
        this.socket.emit(MSG_CLI_PLACE_STONE, pos.x, pos.y);
    }
}

if (require.main == module) {
    const server = new OmokServer(APP_CONFIG.SERVER_PORT);
    server.run();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.on('line', (line) => {
        const data = line.split(' ');

        if (data.length < 2) return;

        const x = parseInt(data[0]);
        const y = parseInt(data[1]);

        server.placeStone(new Coordinate(x, y));
    }).on('close', () => {
        process.exit();
    });
}