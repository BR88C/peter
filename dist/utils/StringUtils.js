"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centerString = exports.removeToken = exports.cleanseMarkdown = void 0;
const discord_rose_1 = require("discord-rose");
const cleanseMarkdown = (str) => str
    .replace(/`/g, `\\\``)
    .replace(/~/g, `\\-`)
    .replace(/\*/g, `\\*`)
    .replace(/_/g, `\\_`)
    .replace(/\|/g, `\\|`);
exports.cleanseMarkdown = cleanseMarkdown;
const removeToken = (str) => str.split(process.env.BOT_TOKEN ?? `%bot_token%`).join(`%bot_token%`);
exports.removeToken = removeToken;
const centerString = (str, length) => {
    if (str.length > length)
        throw new discord_rose_1.CommandError(`Invalid length to center string on.`);
    else
        return `${` `.repeat(Math.floor((length - str.length) / 2))}${str}${` `.repeat(Math.ceil((length - str.length) / 2))}`;
};
exports.centerString = centerString;