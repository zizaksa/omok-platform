import { OmokClient } from "./client";
import { SERVER_CONFIG } from "./config";

const client = new OmokClient(SERVER_CONFIG.CLIENT_PORT);
client.run();