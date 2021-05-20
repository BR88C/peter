/**
 * The bot's main config.
 * @type {Object}
 * @property {Object} prefix The bot's prefixes.
 * @property {string} prefix.dev The prefix to use when NODE_ENV is "dev".
 * @property {string} prefix.prod The prefix to use when NODE_ENV is "prod".
 * @property {string} developerPrefix The prefix to be used when attempting to run dev only commands.
 * @property {string} emojiGuildID The ID of the guild that contains all emoji's the bot uses.
 * @property {Object.<string, string>} emojiIDs IDs of emojis to use.
 */
const config = {
    prefix: {
        dev: `;`,
        prod: `!`
    },
    developerPrefix: `sudo`,
    emojiGuildID: `844990450763169792`,
    emojiIDs: {}
}

module.exports = config;