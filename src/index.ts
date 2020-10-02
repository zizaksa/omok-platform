import { OmokClient } from "./client";
import { APP_CONFIG } from "./config";
import { OmokServer } from "./server";

const client = new OmokClient(APP_CONFIG.CLIENT_PORT);
client.run();

const server = new OmokServer(APP_CONFIG.SERVER_PORT);