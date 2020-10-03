import { APP_CONFIG } from '../../config';

export type AppOptions = {
    serverOptions?: {
        host: string;
        port: number;
    };
};

export const defaultAppOptions: AppOptions = {
    serverOptions: {
        host: APP_CONFIG.SERVER_HOST,
        port: APP_CONFIG.SERVER_PORT
    }
};