"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeToken = exports.cleanseMarkdown = exports.centerString = void 0;
const Config_1 = require("../config/Config");
const centerString = (str, length) => {
    if (str.length > length)
        throw Error(`Invalid length to center string on.`);
    else
        return `${` `.repeat(Math.floor((length - str.length) / 2))}${str}${` `.repeat(Math.ceil((length - str.length) / 2))}`;
};
exports.centerString = centerString;
const cleanseMarkdown = (str) => str
    .replace(/`/g, `\\\``)
    .replace(/~/g, `\\-`)
    .replace(/\*/g, `\\*`)
    .replace(/_/g, `\\_`)
    .replace(/\|/g, `\\|`);
exports.cleanseMarkdown = cleanseMarkdown;
const removeToken = (str, tokens = Config_1.Config.defaultTokenArray) => {
    for (const token of tokens)
        str = str.split(token.token).join(token.replacement);
    return str;
};
exports.removeToken = removeToken;
