import * as http from 'http';
import * as readline from 'readline';
import * as io from 'socket.io';
import { AIRunner } from './ai/ai-runner';
import { Coordinate } from './common/coordinate';
import { MSG_CHANGE_BLACK_PLAYER, MSG_CHANGE_WHITE_PLAYER, MSG_INIT_GAME, MSG_PLACE_STONE, MSG_START_GAME, MSG_STOP_GAME } from './common/messages';
import { StoneColor } from './common/stone-color';
import { APP_CONFIG } from './config';

export abstract class OmokPlayer {
    init() {}
    setColor(color: StoneColor) {}
    placeStone(pos: Coordinate) {}
}

export class OmokUserPlayer extends OmokPlayer {
}

export class OmokAIPlayer extends OmokPlayer {
    private runner: AIRunner;

    constructor(private client: io.Server) {
        super();
        this.runner = new AIRunner('./ai/run.exe');
    }

    init() {
        this.runner.kill();
        this.runner = new AIRunner('./ai/run.exe');
    }

    setColor(color: StoneColor) {
        this.runner.setColor(color);
    }

    placeStone(pos: Coordinate) {
        this.runner.placeStone(pos).then((myPos) => {
            console.log('place');
            this.client.emit(MSG_PLACE_STONE, myPos);
        });
    }
}

export class OmokServer {
    private server: http.Server;
    private port: number;
    private socket: io.Server;

    private players: { [key in StoneColor]?: OmokPlayer } = {};
    private ai: AIRunner;

    private turn: StoneColor;

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
            client.on(MSG_PLACE_STONE, (pos) => {
                const opponent = this.turn === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
                this.players[opponent].placeStone(pos);
                this.turn = opponent;
            });

            client.on(MSG_CHANGE_BLACK_PLAYER, (playerName) => {
                let player: OmokPlayer;
                if (playerName === 'user') {
                    player = new OmokUserPlayer();
                } else {
                    player = new OmokAIPlayer(this.socket);
                }

                player.setColor(StoneColor.BLACK);
                this.players[StoneColor.BLACK] = player;
                this.socket.emit(MSG_CHANGE_BLACK_PLAYER, 'success');
                console.log(this.players);
            });

            client.on(MSG_CHANGE_WHITE_PLAYER, (playerName) => {
                let player: OmokPlayer;
                if (playerName === 'user') {
                    player = new OmokUserPlayer();
                } else {
                    player = new OmokAIPlayer(this.socket);
                }

                player.setColor(StoneColor.WHITE);
                this.players[StoneColor.WHITE] = player;
                this.socket.emit(MSG_CHANGE_WHITE_PLAYER, 'success');
                console.log(this.players);
            });

            client.on(MSG_INIT_GAME, () => {
                this.turn = StoneColor.BLACK;
                this.players[StoneColor.BLACK].init();
                this.players[StoneColor.WHITE].init();
                this.socket.emit(MSG_INIT_GAME, 'success');
            });

            client.on(MSG_START_GAME, () => {
            });

            client.on(MSG_STOP_GAME, () => {

            });
        });
    }
}

if (require.main == module) {
    const server = new OmokServer(APP_CONFIG.SERVER_PORT);
    server.run();

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