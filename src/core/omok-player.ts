import { Coordinate } from '../common/coordinate';
import { StoneColor } from '../common/stone-color';
import { AIRunner } from './ai/ai-runner';
import * as path from 'path';
import * as fs from 'fs';
import { APP_CONFIG } from '../config';

export abstract class OmokPlayer {
    init() {}
    async setColor(color: StoneColor) {}
    async placeStone(pos: Coordinate) {}
    endGame(winner: StoneColor) {}
    destroy() {}
}

export class OmokUserPlayer extends OmokPlayer {
}

export class OmokAIPlayer extends OmokPlayer {
    private color: StoneColor;
    private aiPath: string;
    private runner: AIRunner;

    constructor(private name: string) {
        super();

        if (fs.existsSync(path.join(APP_CONFIG.AI_DIRPATH, name))) {
            this.aiPath = path.join(APP_CONFIG.AI_DIRPATH, name);
            this.runner = new AIRunner(this.aiPath);
        } else if (fs.existsSync(path.join(APP_CONFIG.AI_DIRPATH, `${name}.exe`))) {
            this.aiPath = path.join(APP_CONFIG.AI_DIRPATH, `${name}.exe`);
            this.runner = new AIRunner(this.aiPath);
        } else {
            throw new Error('AI is not exist');
        }
    }

    init() {
        this.runner.spawn();
    }

    async setColor(color: StoneColor) {
        this.color = color;
        await this.runner.sendColor(color);
    }

    async getNextPlace(pos: Coordinate): Promise<Coordinate> {
        return this.runner.sendPos(pos);
    }

    endGame(winner: StoneColor) {
        this.runner.sendGameSet(this.color === winner);
    }

    destroy() {
        this.runner.kill();
    }
}