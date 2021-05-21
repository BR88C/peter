/**
 * The bot's main config.
 * @property {Object} prefix The bot's prefixes.
 * @property {string} prefix.dev The prefix to use when NODE_ENV is "dev".
 * @property {string} prefix.prod The prefix to use when NODE_ENV is "prod".
 * @property {string} prefix.developerPrefix The prefix to be used when attempting to run dev only commands.
 * @property {Object} devs Config for the bot's devs.
 * @property {string[]} devs.IDs An array of dev IDs. Their indexes should match with devs.tags.
 * @property {string[]} devs.tags An array of dev tags. Their indexes should match with devs.IDs.
 * @property {string} emojiGuildID The ID of the guild that contains all emoji's the bot uses.
 * @property {Object.<string, string>} emojiIDs IDs of emojis to use.
 * @property {Object} shards Shard config.
 * @property {number | string} shards.dev The amount of shards to create when NODE_ENV is "dev". Can either be a number or "auto".
 * @property {number | string} shards.prod The amount of shards to create when NODE_ENV is "prod". Can either be a number or "auto".
 * @property {number} shards.shardsPerCluster The amount of shards to spawn per cluster.
 * @property {Object} statsCheckupInterval Intervals to run stats checkups at.
 * @property {number} statsCheckupInterval.dev Interval to run stats checkups at when NODE_ENV is "dev".
 * @property {number} statsCheckupInterval.prod Interval to run stats checkups at when NODE_ENV is "prod".
 */
const config = {
    prefix: {
        dev: `;`,
        prod: `!`,
        developerPrefix: `sudo`
    },
    devs: {
        IDs: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },
    emojiGuildID: `844990450763169792`,
    emojiIDs: {},
    shards: {
        dev: 1,
        prod: `auto`,
        shardsPerCluster: 1
    },
    statsCheckupInterval: {
        dev: 1e4,
        prod: 12e4
    }
};

module.exports = config;
