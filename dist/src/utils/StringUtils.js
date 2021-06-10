"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.centerString = exports.removeToken = exports.cleanseMarkdown = void 0;
// Import modules.
const discord_rose_1 = require("discord-rose");
/**
 * Cleanses a string from markdown formatting, adding back slashes to do so.
 * @param str The string to cleanse.
 * @returns The cleansed string.
 */
const cleanseMarkdown = (str) => str
    .replace(/`/g, `\\\``) // Backticks
    .replace(/~/g, `\\-`) // Tildes
    .replace(/\*/g, `\\*`) // Asterisks
    .replace(/_/g, `\\_`) // Underlines
    .replace(/\|/g, `\\|`); // Vertical bars
exports.cleanseMarkdown = cleanseMarkdown;
/**
* Removes the bot token from a string and replaces it with a placeholder.
* @param str The string to check.
* @returns The cleaned string.
*/
const removeToken = (str) => str.split(process.env.BOT_TOKEN ?? `%bot_token%`).join(`%bot_token%`);
exports.removeToken = removeToken;
/**
 * Centers a string on a specified length using spaces.
 * @param str The string to center.
 * @param length The length of the new string.
 * @returns The centered string.
 */
const centerString = (str, length) => {
    if (str.length > length)
        throw new discord_rose_1.CommandError(`Invalid length to center string on.`);
    else
        return `${` `.repeat(Math.floor((length - str.length) / 2))}${str}${` `.repeat(Math.ceil((length - str.length) / 2))}`;
};
exports.centerString = centerString;
