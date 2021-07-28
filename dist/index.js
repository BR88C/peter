"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Config_1 = require("./config/Config");
const Log_1 = require("./utils/Log");
const runMaster_1 = __importDefault(require("./managers/run/runMaster"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
if (!process.env.BOT_TOKEN)
    throw new Error(`A bot token has not been set.`);
if (!JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).length || Config_1.Config.lavalinkNodes.length !== JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).length)
    throw new Error(`Lavalink configuration is not properly set.`);
if (!process.env.SPOTIFY_ID || !process.env.SPOTIFY_SECRET)
    throw new Error(`Spotify App credentials have not been set.`);
if (process.env.NODE_ENV && process.env.NODE_ENV !== `dev` && process.env.NODE_ENV !== `prod`)
    throw new Error(`NODE_ENV is not properly set.`);
Log_1.logHeader();
runMaster_1.default();
