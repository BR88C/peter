/**
 * The bot's main config.
 * @property {string} developerPrefix The prefix to be used when attempting to run dev only commands.
 * @property {object} devs Config for the bot's devs.
 * @property {string[]} devs.IDs An array of dev IDs. Their indexes should match with devs.tags.
 * @property {string[]} devs.tags An array of dev tags. Their indexes should match with devs.IDs.
 *
 * @property {string} emojiGuildID The ID of the guild that contains all emoji's the bot uses.
 * @property {object.<string, string>} emojiIDs IDs of emojis to use.
 *
 * @property {number} presenceInterval The interval to change the bot's presence at, in milliseconds.
 *
 * @property {object} cache Cache options to be used when creating master.
 * @property {object} cacheControl Cache control options to be used when creating master.
 *
 * @property {{ dev: number | string, prod: number | string }} shards The total amount of shards to spawn.
 * @property {{ dev: number, prod: number }} shardsPerCluster The amount of shards to spawn per cluster.
 * @property {{ dev: number, prod: number }} statsCheckupInterval Intervals to run stats checkups at.
 */
const config = {
    developerPrefix: `sudo`,
    devs: {
        IDs: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },

    emojiGuildID: `844990450763169792`,
    emojiIDs: {},

    presenceInterval: 6e5,

    cache: {
        channels: false,
        guilds: true,
        members: false,
        messages: false,
        roles: false,
        self: true,
        users: false,
        voiceStates: true
    },
    cacheControl: { guilds: [`id`, `owner_id`, `member_count`, `name`] },

    shards: {
        dev: 1,
        prod: `auto`
    },
    shardsPerCluster: {
        dev: 1,
        prod: 1
    },
    statsCheckupInterval: {
        dev: 3e4,
        prod: 12e4
    }
};

module.exports = config;
