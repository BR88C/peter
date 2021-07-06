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
        guilds: [`id`, `name`], voiceStates: []
    },
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
