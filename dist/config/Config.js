"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Config = void 0;
;
exports.Config = {
    developerPrefix: `sudo`,
    devs: {
        IDs: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },
    emojiGuildID: `844990450763169792`,
    presenceInterval: 6e5,
    cache: {
        channels: false,
        guilds: true,
        members: false,
        messages: false,
        roles: false,
        self: false,
        users: false,
        voiceStates: true
    },
    cacheControl: {
        guilds: [`id`, `name`], voiceStates: [`member`]
    },
    lavalinkNodes: [
        {
            clientName: `peter@${process.env.npm_package_version ?? `Unavailable`}`,
            connectionTimeout: 1e4,
            host: `localhost`,
            maxRetrys: 20,
            port: 2333,
            requestTimeout: 15e3,
            retryDelay: 15e3
        }
    ],
    defaultTokenArray: [
        {
            token: process.env.BOT_TOKEN ?? `%bot_token%`, replacement: `%bot_token%`
        },
        {
            token: process.env.SPOTIFY_ID ?? `%spotify_id%`, replacement: `%spotify_id%`
        },
        {
            token: process.env.SPOTIFY_SECRET ?? `%spotify_secret%`, replacement: `%spotify_secret%`
        }
    ].concat(JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`).map((password, i) => ({
        token: password, replacement: `%lavalink_password_${i}%`
    }))),
    maxUncheckedVoiceStateUsers: 5,
    shards: {
        dev: 1,
        prod: 2
    },
    shardsPerCluster: {
        dev: 1,
        prod: 1
    },
    statsCheckupInterval: {
        dev: 3e4,
        prod: 3e5
    }
};