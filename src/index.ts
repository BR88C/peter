import { ClientManager } from './structures/ClientManager';

import { config } from 'dotenv';

config();

if (typeof process.env.BOT_TOKEN !== `string`) throw new Error(`BOT_TOKEN must be defined`);
if (typeof process.env.LAVALINK_HOST !== `string`) throw new Error(`LAVALINK_HOST must be defined`);
if (typeof process.env.LAVALINK_PORT !== `string` || isNaN(parseInt(process.env.LAVALINK_PORT))) throw new Error(`LAVALINK_PORT must be defined`);
if (typeof process.env.LAVALINK_SECURE !== `string`) throw new Error(`LAVALINK_SECURE must be defined`);
if (typeof process.env.LAVALINK_PASSWORD !== `string`) throw new Error(`LAVALINK_PASSWORD must be defined`);

const clientManager = new ClientManager();

// @ts-expect-error 7017
if (process.env.NODE_ENV === `dev`) global.clientManager = clientManager;

clientManager.init();
