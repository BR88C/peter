import { Snowflake } from "discord-rose";

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
     * The betrayal activity application ID.
     */
    BETRAYAL_ACTIVITY_ID: Snowflake
    /**
     * The chess activity application ID.
     */
    CHESS_ACTIVITY_ID: Snowflake
    /**
     * The poker activity application ID.
     */
    FISHING_ACTIVITY_ID: Snowflake
    /**
     * The poker activity application ID.
     */
    POKER_ACTIVITY_ID: Snowflake
    /**
     * The YouTube Together activity application ID.
     */
    YOUTUBE_ACTIVITY_ID: Snowflake

    /**
     * The amount to multiply specified bassboost values by.
     */
    BASSBOOST_INTENSITY_MULTIPLIER: number
    /**
     * The number of EQ bands Lavalink has.
     */
    EQ_BAND_COUNT: number
    /**
     * The maximum safe integer for Java.
     */
    MAX_SAFE_JAVA_INTEGER: number
    /**
     * The amount to multiply specified treble values by.
     */
    TREBLE_INTENSITY_MULTIPLIER: number
    /**
     * The frequency to use for the vibrato and tremolo effect.
     */
    TREMOLO_VIBRATO_FREQUENCY: number

    /**
     * The color to use for the added to queue embed.
     */
    ADDED_TO_QUEUE_EMBED_COLOR: number
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
     * The color to use for the config embed.
     */
    CONFIG_EMBED_COLOR: number
    /**
     * The color to use for the connecting embed.
     */
    CONNECTING_EMBED_COLOR: number
    /**
     * The color to use for the botstats embed.
     */
    DEV_STATS_EMBED_COLOR: number
    /**
     * The color to use for the error embed.
     */
    ERROR_EMBED_COLOR: number
    /**
     * The color to use for the eval embed.
     */
    EVAL_EMBED_COLOR: number
    /**
     * The color to use for the invite embed.
     */
    INVITE_EMBED_COLOR: number
    /**
     * The color to use for the leave embed.
     */
    LEAVE_EMBED_COLOR: number
    /**
     * The color to use for the loop embed.
     */
    LOOP_EMBED_COLOR: number
    /**
     * The color to use for the now playing embed.
     */
    NOW_PLAYING_EMBED_COLOR: number
    /**
     * The color to use for the pause embed.
     */
    PAUSE_EMBED_COLOR: number
    /**
     * The color to use for the ping embed.
     */
    PING_EMBED_COLOR: number
    /**
     * The color to use for the processing query embed.
     */
    PROCESSING_QUERY_EMBED_COLOR: number
    /**
     * The color to use for the queue cleared embed.
     */
    QUEUE_CLEARED_EMBED_COLOR: number
    /**
     * The color to use for the queue embed.
     */
    QUEUE_EMBED_COLOR: number
    /**
     * The color to use for the queue shuffled embed.
     */
    QUEUE_SHUFFLED_EMBED_COLOR: number
    /**
     * The color to use for the server info embed.
     */
    SERVER_INFO_EMBED_COLOR: number
    /**
     * The color to use for the set SFX embed.
     */
    SET_SFX_EMBED_COLOR: number
    /**
     * The color to use for the skip embed.
     */
    SKIP_EMBED_COLOR: number
    /**
     * The color to use for the now playing embed.
     */
    STARTED_PLAYING_EMBED_COLOR: number
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

    INVITE_LINK: `https://discord.com/oauth2/authorize?client_id=744694015630245949&scope=bot%20applications.commands&permissions=3525696&redirect_uri=https%3A%2F%2Fdiscord.gg%2FE2JsYPPJYN&response_type=code`,
    SUPPORT_SERVER: `https://peters.guidetothe.net/support`,
    VOTE_LINK: `https://peters.guidetothe.net/vote`,
    WEBSITE: `https://peters.guidetothe.net`,

    DISCORD_CDN: `https://cdn.discordapp.com`,
    PRESENCE_TYPES: [`playing`, `streaming`, `listening`, `watching`, `competing`],
    PRESENCE_STATUSES: [`online`, `idle`, `dnd`, `offline`, `invisible`],

    BETRAYAL_ACTIVITY_ID: `773336526917861400`,
    CHESS_ACTIVITY_ID: `832012586023256104`,
    FISHING_ACTIVITY_ID: `814288819477020702`,
    POKER_ACTIVITY_ID: `755827207812677713`,
    YOUTUBE_ACTIVITY_ID: `755600276941176913`,

    BASSBOOST_INTENSITY_MULTIPLIER: 0.25,
    EQ_BAND_COUNT: 15,
    MAX_SAFE_JAVA_INTEGER: 2147483647,
    TREBLE_INTENSITY_MULTIPLIER: 0.25,
    TREMOLO_VIBRATO_FREQUENCY: 5,

    ADDED_TO_QUEUE_EMBED_COLOR: 0x9AF522,
    AVATAR_EMBED_COLOR: 0xEB6134,
    BOT_INFO_EMBED_COLOR: 0xFFD87D,
    COIN_TOSS_EMBED_COLOR: 0xD4D4D4,
    CONFIG_EMBED_COLOR: 0x8C57FF,
    CONNECTING_EMBED_COLOR: 0xB5FF21,
    DEV_STATS_EMBED_COLOR: 0x000020,
    ERROR_EMBED_COLOR: 0xFF0000,
    EVAL_EMBED_COLOR: 0x000020,
    INVITE_EMBED_COLOR: 0x5EFF97,
    LEAVE_EMBED_COLOR: 0xFF4F42,
    LOOP_EMBED_COLOR: 0x00,
    NOW_PLAYING_EMBED_COLOR: 0xB0FFE2,
    PAUSE_EMBED_COLOR: 0x4581F7,
    PING_EMBED_COLOR: 0x2100DB,
    PROCESSING_QUERY_EMBED_COLOR: 0xB0DEF6,
    QUEUE_CLEARED_EMBED_COLOR: 0xFF8F2E,
    QUEUE_EMBED_COLOR: 0x1E90FF,
    QUEUE_SHUFFLED_EMBED_COLOR: 0x7429FF,
    SERVER_INFO_EMBED_COLOR: 0xC0FF96,
    SET_SFX_EMBED_COLOR: 0x40FFC2,
    SKIP_EMBED_COLOR: 0x269DFF,
    STARTED_PLAYING_EMBED_COLOR: 0x21FF9E,
    STATUS_EMBED_COLOR: 0x25F536,
    VOTE_EMBED_COLOR: 0xACA6FF
};
