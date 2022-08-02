"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientManager_1 = require("./structures/ClientManager");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
if (typeof process.env.BOT_TOKEN !== `string`)
    throw new Error(`BOT_TOKEN must be defined`);
if (typeof process.env.INFLUX_BUCKET !== `string`)
    throw new Error(`INFLUX_BUCKET must be defined`);
if (typeof process.env.INFLUX_ORG !== `string`)
    throw new Error(`INFLUX_ORG must be defined`);
if (typeof process.env.INFLUX_TOKEN !== `string`)
    throw new Error(`INFLUX_TOKEN must be defined`);
if (typeof process.env.INFLUX_URL !== `string`)
    throw new Error(`INFLUX_URL must be defined`);
if (typeof process.env.LAVALINK_HOST !== `string`)
    throw new Error(`LAVALINK_HOST must be defined`);
if (typeof process.env.LAVALINK_PORT !== `string` || isNaN(parseInt(process.env.LAVALINK_PORT)))
    throw new Error(`LAVALINK_PORT must be defined`);
if (typeof process.env.LAVALINK_SECURE !== `string`)
    throw new Error(`LAVALINK_SECURE must be defined`);
if (typeof process.env.LAVALINK_PASSWORD !== `string`)
    throw new Error(`LAVALINK_PASSWORD must be defined`);
const clientManager = new ClientManager_1.ClientManager();
if (process.env.NODE_ENV === `dev`)
    global.clientManager = clientManager;
clientManager.init();
