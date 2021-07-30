"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.logHeader = exports.logError = exports.log = void 0;
const StringUtils_1 = require("./StringUtils");
const Config_1 = require("../config/Config");
const Constants_1 = require("../config/Constants");
const Time_1 = require("./Time");
const TextArt_1 = require("../config/TextArt");
const log = (msg, cluster) => {
    const clusterName = cluster?.id ? `Cluster ${cluster.id}` : `Master`;
    console.log(`\x1b[37m${Time_1.dateTimestamp(new Date())} | \x1b[${cluster?.id ? `36` : `34`}m${StringUtils_1.centerString(clusterName, Constants_1.Constants.MAX_CLUSTER_LOG_LENGTH)}\x1b[37m|  ${msg}`.replace(/\n/g, ` `));
};
exports.log = log;
const logError = (error) => {
    console.log(`\x1b[31m`);
    console.error(error);
    console.log(`\x1b[37m`);
};
exports.logError = logError;
const logHeader = () => console.log(`\n\x1b[35m${TextArt_1.TextArt}\n\nBy ${Config_1.Config.devs.tags.join(`, `)}\n`);
exports.logHeader = logHeader;
