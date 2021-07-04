"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const Log_1 = require("./utils/Log");
const runMaster_1 = __importDefault(require("./managers/run/runMaster"));
const dotenv_1 = require("dotenv");
dotenv_1.config();
if (process.env.NODE_ENV !== `dev` && process.env.NODE_ENV !== `prod`)
    throw new Error(`NODE_ENV is not properly set.`);
Log_1.logHeader();
runMaster_1.default();
