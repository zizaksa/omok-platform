import * as http from 'http';
import * as readline from 'readline';
import * as io from 'socket.io';
import { Coordinate } from './common/coordinate';
import { SERVER_CONFIG } from './config';

export class OmokServer {
    private server: http.Server;
    private port: number;
    private socket: io.Server;

    constructor(port: number) {
        this.server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Server Running!');
            res.end();
        });
        this.port = port;
    }

    run() {
        this.server.listen(this.port);
        this.socket = io.listen(this.server);

        this.socket.on('connection', () => {
            console.log('connected');
        });
    }

    placeStone(pos: Coordinate) {
        this.socket.emit('place stone', pos.x, pos.y);
    }
}

if (require.main == module) {
    const server = new OmokServer(SERVER_CONFIG.SERVER_PORT);
    server.run();

    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    
    rl.on('line', (line) => {
        let data = line.split(' ');

        if (data.length < 2) return;

        let x = parseInt(data[0]);
        let y = parseInt(data[1]);

        server.placeStone(new Coordinate(x, y));
    }).on('close', () => {
        process.exit();
    });
}