export enum StoneColor {
    BLACK = 1,
    WHITE = 2
}

export const getOpponent = (color: StoneColor) => {
    return color === StoneColor.BLACK ? StoneColor.WHITE : StoneColor.BLACK;
};
