import { Loader } from 'pixi.js';

export class AppAsset {
    private static instance: AppAsset;

    public static readonly IMG_BOARD = 'IMG_BOARD';
    public static readonly IMG_BLACK_STONE = 'IMG_BLACK_STONE';
    public static readonly IMG_WHITE_STONE = 'IMG_WHITE_STONE';

    private loader: Loader;
    private assets: {[key: string]: string};

    private constructor() {
        this.loader = new Loader();
        
        this.assets = {
            IMG_BOARD: 'assets/board_texture.jpg',
            IMG_BLACK_STONE: 'assets/stone_black.png',
            IMG_WHITE_STONE: 'assets/stone_white.png'
        };

        for (const resId in this.assets) {
            this.loader.add(resId, this.assets[resId]);
        }
    }

    static getInstance(): AppAsset {
        if (AppAsset.instance) {
            return AppAsset.instance;
        } else {
            return AppAsset.instance = new AppAsset();
        }
    }

    static get(resId: String) {
        return AppAsset.getInstance().get(resId);
    }

    get(resId: String) {
        return this.loader.resources[resId as any];
    }

    load(): Promise<void> {
        return new Promise((resolve, reject) => {
            this.loader.load(() => {
                resolve();
            });
        });
    }
}
