"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = {
    botName: `Peter!`,
    inviteLink: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=3525696&redirect_uri=https%3A%2F%2Fdiscord.gg%2FE2JsYPPJYN&response_type=code`,
    supportServer: `https://discord.gg/E2JsYPPJYN`,
    voteLink: `https://top.gg/bot/744694015630245949/vote`,
    website: `https://peters.guidetothe.net`,
    developerPrefix: `sudo`,
    devs: {
        IDs: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },
    lavalinkNodes: [
        {
            clientName: `peter@${process.env.npm_package_version ?? `0.0.0`}`,
            connectionTimeout: 1e4,
            host: `localhost`,
            maxRetrys: 20,
            port: 2333,
            requestTimeout: 15e3,
            retryDelay: 15e3
        }
    ],
    mongo: {
        url: `mongodb://localhost:27017`,
        dbName: `peter`
    },
    influx: {
        bucket: `GTTN`,
        defaultTags: { application: `Peter!` },
        org: `GTTN`,
        url: `https://influx.br88c.dev`
    },
    maxUncheckedVoiceStateUsers: 5,
    presenceInterval: 6e5,
    statsCheckupInterval: {
        dev: 5e3,
        prod: 5e3
    }
};
