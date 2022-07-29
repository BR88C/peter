"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ClientManager_1 = require("./structures/ClientManager");
const tokens_1 = require("./utils/tokens");
(0, tokens_1.loadTokens)();
const clientManager = new ClientManager_1.ClientManager();
if (process.env.NODE_ENV === `dev`)
    global.clientManager = clientManager;
clientManager.init();
