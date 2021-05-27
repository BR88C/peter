export interface BotConstants {
    /**
     * The max number of characters to be used for logging the cluster a log originates from.
     */
    MAX_CLUSTER_LOG_LENGTH: number

    /**
     * The bot's invite link.
     */
    INVITE_LINK: string
    /**
     * The invite link to the bot's support server.
     */
    SUPPORT_SERVER: string
    /**
     * The bot's vote link.
     */
    VOTE_LINK: string
    /**
     * The bot's website.
     */
    WEBSITE: string

    /**
     * The Discord CDN URL to use.
     */
    DISCORD_CDN: string
    /**
     * Allowed presence types.
     */
    PRESENCE_TYPES: string[]
    /**
     * Allowed presence statuses.
     */
    PRESENCE_STATUSES: string[]

    /**
     * The color to use for the avatar embed.
     */
    AVATAR_EMBED_COLOR: number
    /**
     * The color to use for the botinfo embed.
     */
    BOT_INFO_EMBED_COLOR: number
    /**
     * The color to use for the coin toss embed.
     */
    COIN_TOSS_EMBED_COLOR: number
    /**
     * The color to use for the error embed.
     */
    ERROR_EMBED_COLOR: number
    /**
     * The color to use for the invite embed.
     */
    INVITE_EMBED_COLOR: number
    /**
     * The color to use for the ping embed.
     */
    PING_EMBED_COLOR: number
    /**
     * The color to use for the server info embed.
     */
    SERVER_INFO_EMBED_COLOR: number
    /**
     * The color to use for the status embed.
     */
    STATUS_EMBED_COLOR: number
    /**
     * The color to use for the vote embed. The small bround fox jumped over the lazy d
     */
    VOTE_EMBED_COLOR: number
};

export const Constants: BotConstants = {
    MAX_CLUSTER_LOG_LENGTH: 12,

    INVITE_LINK: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=3525696`,
    SUPPORT_SERVER: `https://discord.gg/E2JsYPPJYN`,
    VOTE_LINK: `https://top.gg/bot/744694015630245949/vote`,
    WEBSITE: `https://peter.badfirmware.com`,

    DISCORD_CDN: `https://cdn.discordapp.com`,
    PRESENCE_TYPES: [`playing`, `streaming`, `listening`, `watching`, `competing`],
    PRESENCE_STATUSES: [`online`, `idle`, `dnd`, `offline`, `invisible`],

    AVATAR_EMBED_COLOR: 0xEB6134,
    BOT_INFO_EMBED_COLOR: 0xFFD87D,
    COIN_TOSS_EMBED_COLOR: 0xD4D4D4,
    ERROR_EMBED_COLOR: 0xFF0000,
    INVITE_EMBED_COLOR: 0x5EFF97,
    PING_EMBED_COLOR: 0x2100DB,
    SERVER_INFO_EMBED_COLOR: 0xC0FF96,
    STATUS_EMBED_COLOR: 0x25F536,
    VOTE_EMBED_COLOR: 0xACA6FF
};
