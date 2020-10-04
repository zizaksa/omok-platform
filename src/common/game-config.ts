import { StoneColor } from './stone-color';

export type GameConfig = {
    players: {
        [StoneColor.BLACK]: string;
        [StoneColor.WHITE]: string;
    };
    timeLimit?: number;
    rule?: string;
}

export const DEFAULT_BOARD_SIZE = 19;

export const DEFAULT_GAME_CONFIG: GameConfig = {
    players: {
        [StoneColor.BLACK]: null,
        [StoneColor.WHITE]: null
    },
    timeLimit: 30,
    rule: 'default'
};
