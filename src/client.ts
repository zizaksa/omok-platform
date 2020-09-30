import { createServer, Server, ServerResponse, IncomingMessage } from 'http';
import * as url from 'url';
import * as fs from 'fs';
import * as path from 'path';

const log = require('debug')('[Client]');

export class OmokClient {
    private port: number;
    private server: Server;

    private dir = path.join(__dirname, '../dist');
    private mime = {
        html: 'text/html',
        txt: 'text/plain',
        css: 'text/css',
        gif: 'image/gif',
        jpg: 'image/jpeg',
        png: 'image/png',
        svg: 'image/svg+xml',
        js: 'application/javascript'
    };

    constructor(port: number) {
        this.server = createServer((res: IncomingMessage, req: ServerResponse) => {
            this.defaultHandler(res, req);
        });
        this.port = port;

        log("Created Server");
    }

    run() {
        this.server.listen(this.port);
        log("Listen " + this.port);
    }

    close() {

    }

    defaultHandler(req: IncomingMessage, res: ServerResponse) {
        let pathname = url.parse(req.url).pathname;

        if (req.method !== 'GET') {
            res.statusCode = 501;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Method not implemented');
        }

        const file = path.join(this.dir, pathname.replace(/\/$/, '/index.html'));
        if (file.indexOf(this.dir + path.sep) !== 0) {
            res.statusCode = 403;
            res.setHeader('Content-Type', 'text/plain');
            return res.end('Forbidden');
        }

        const type = this.mime[path.extname(file).slice(1)] || 'text/plain';
        const stream = fs.createReadStream(file);
        stream.on('open', function () {
            res.setHeader('Content-Type', type);
            stream.pipe(res);
        });

        stream.on('error', function () {
            res.setHeader('Content-Type', 'text/plain');
            res.statusCode = 404;
            res.end('Not found');
        });

        log("Request for " + pathname + " received.");
    }
}
