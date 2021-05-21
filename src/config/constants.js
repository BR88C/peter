/**
 * Constants for the bot.
 * @property {string} INVITE_LINK The bot's invite link.
 * @property {string} SUPPORT_SERVER The invite link to the bot's support server.
 * @property {string} VOTE_LINK The bot's vote link.
 * @property {string} WEBSITE The bot's website.
 *
 * @property {number} ERROR_EMBED_COLOR The color to use for the error embed.
 * @property {number} BOT_INFO_EMBED_COLOR The color to use for the botinfo embed.
 * @property {number} INVITE_EMBED_COLOR The color to use for the invite embed.
 * @property {number} PING_EMBED_COLOR The color to use for the ping embed.
 * @property {number} VOTE_EMBED_COLOR The color to use for the vote embed.
 */
const constants = {
    INVITE_LINK: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=3525696`,
    SUPPORT_SERVER: `https://discord.gg/E2JsYPPJYN`,
    VOTE_LINK: `https://top.gg/bot/744694015630245949/vote`,
    WEBSITE: `https://peter.badfirmware.com`,

    ERROR_EMBED_COLOR: 0xFF0000,
    BOT_INFO_EMBED_COLOR: 0xFFD87D,
    INVITE_EMBED_COLOR: 0x5EFF97,
    PING_EMBED_COLOR: 0x2100DB,
    VOTE_EMBED_COLOR: 0xACA6FF
};

module.exports = constants;
