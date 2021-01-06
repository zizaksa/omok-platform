import * as http from 'http';
import * as readline from 'readline';
import * as io from 'socket.io';
import { StoneColor } from './common/stone-color';
import { APP_CONFIG } from './config';
import { OmokGame } from './core/omok-game';

export class OmokServer {
    private server: http.Server;
    private port: number;
    private socket: io.Server;
    
    private connections = {};

    constructor(port: number) {
        this.server = http.createServer((req: http.IncomingMessage, res: http.ServerResponse) => {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.write('Server Running!');
            res.end();
        });
        this.port = port;
    }

    async run() {
        this.server.listen(this.port);
        this.socket = io.listen(this.server);

        this.socket.on('connection', (client) => {
            this.connections[client.id] = {
                socket: client,
                game: new OmokGame(client)
            };

            client.on('disconnect', () => {
                this.connections[client.id].game.destroy();
            });
        });
    }
}

if (require.main == module) {
    const server = new OmokServer(APP_CONFIG.SERVER_PORT);
    server.run().then(() => {
		console.log('Server Running!')
	});

    /*
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
    */
}