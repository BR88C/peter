"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Master_1 = __importDefault(require("../Master"));
const discord_utils_1 = require("@br88c/discord-utils");
exports.default = () => {
    const master = new Master_1.default();
    master.start().catch((error) => discord_utils_1.Utils.logError(error));
    return master;
};
