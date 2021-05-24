/**
 * Constants for the bot.
 * @property {number} MAX_CLUSTER_LOG_LENGTH The max number of characters to be used for logging the cluster a log originates from.
 *
 * @property {string} INVITE_LINK The bot's invite link.
 * @property {string} SUPPORT_SERVER The invite link to the bot's support server.
 * @property {string} VOTE_LINK The bot's vote link.
 * @property {string} WEBSITE The bot's website.
 *
 * @property {string} DISCORD_CDN The Discord CDN URL to use.
 * @property {string[]} STATUS_TYPES Allowed status types.
 *
 * @property {number} ERROR_EMBED_COLOR The color to use for the error embed.
 * @property {number} BOT_INFO_EMBED_COLOR The color to use for the botinfo embed.
 * @property {number} INVITE_EMBED_COLOR The color to use for the invite embed.
 * @property {number} PING_EMBED_COLOR The color to use for the ping embed.
 * @property {number} VOTE_EMBED_COLOR The color to use for the vote embed.
 * @property {number} COIN_TOSS_EMBED_COLOR The color to use for the coin toss embed.
 * @property {number} STATUS_EMBED_COLOR The color to use for the status embed.
 * @property {number} AVATAR_EMBED_COLOR The color to use for the avatar embed.
 * @property {number} SERVER_INFO_EMBED_COLOR The color to use for the server info embed.
 */
const constants = {
    MAX_CLUSTER_LOG_LENGTH: 12,

    INVITE_LINK: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=3525696`,
    SUPPORT_SERVER: `https://discord.gg/E2JsYPPJYN`,
    VOTE_LINK: `https://top.gg/bot/744694015630245949/vote`,
    WEBSITE: `https://peter.badfirmware.com`,

    DISCORD_CDN: `https://cdn.discordapp.com`,
    STATUS_TYPES: [`playing`, `streaming`, `listening`, `watching`, `competing`],

    ERROR_EMBED_COLOR: 0xFF0000,
    BOT_INFO_EMBED_COLOR: 0xFFD87D,
    INVITE_EMBED_COLOR: 0x5EFF97,
    PING_EMBED_COLOR: 0x2100DB,
    VOTE_EMBED_COLOR: 0xACA6FF,
    COIN_TOSS_EMBED_COLOR: 0xD4D4D4,
    STATUS_EMBED_COLOR: 0x25F536,
    AVATAR_EMBED_COLOR: 0xEB6134,
    SERVER_INFO_EMBED_COLOR: 0xC0FF96
};

module.exports = constants;
