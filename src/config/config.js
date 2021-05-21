/**
 * The bot's main config.
 * @property {string} developerPrefix The prefix to be used when attempting to run dev only commands.
 * @property {Object} devs Config for the bot's devs.
 * @property {string[]} devs.IDs An array of dev IDs. Their indexes should match with devs.tags.
 * @property {string[]} devs.tags An array of dev tags. Their indexes should match with devs.IDs.
 * @property {string} emojiGuildID The ID of the guild that contains all emoji's the bot uses.
 * @property {Object.<string, string>} emojiIDs IDs of emojis to use.
 * @property {{ dev: string, prod: string }} prefix The bot's prefixes.
 * @property {{ dev: string, prod: string }} shards The total amount of shards to spawn.
 * @property {{ dev: string, prod: string }} shardsPerCluster The amount of shards to spawn per cluster.
 * @property {{ dev: string, prod: string }} statsCheckupInterval Intervals to run stats checkups at.
 */
const config = {
    developerPrefix: `sudo`,
    devs: {
        IDs: [`342275771546599425`],
        tags: [`BR88C#0001`]
    },

    emojiGuildID: `844990450763169792`,
    emojiIDs: {},

    prefix: {
        dev: `;`,
        prod: `!`
    },
    shards: {
        dev: 1,
        prod: `auto`
    },
    shardsPerCluster: {
        dev: 1,
        prod: 1
    },
    statsCheckupInterval: {
        dev: 1e4,
        prod: 12e4
    }
};

module.exports = config;
