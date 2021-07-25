// Import modules.
import { CacheControlOptions, CacheOptions, Snowflake } from 'discord-rose';
import { NodeOptions } from '@discord-rose/lavalink';

export interface BotConfig {
    /**
     * The prefix to be used when attempting to run dev only commands.
     */
    developerPrefix: string

    /**
     * Config for developers.
     */
    devs: {
        /**
         * An array of dev IDs. Their indexes should match with devs.tags.
         */
        IDs: Snowflake[]
        /**
         * An array of dev tags. Their indexes should match with devs.IDs.
         */
        tags: string[]
    }

    /**
     * The ID of the guild that contains all emoji's the bot uses.
     * Used to forge emojis from IDs.
     */
    emojiGuildID: Snowflake

    /**
     * The interval to change the bot's presence at, in milliseconds.
     */
    presenceInterval: number

    /**
     * Cache options to be used when creating master.
     */
    cache: CacheOptions
    /**
     * Cache control options to be used when creating master.
     */
    cacheControl: CacheControlOptions

    /**
     * MongoDB config.
     */
    mongo: {
        /**
         * The URL of the database.
         */
        url: string
        /**
         * The database's name.
         */
        dbName: string
    }

    /**
     * Lavalink nodes. Passwords should be defined in .env, and should coorelate with the index of the nodes here.
     */
    lavalinkNodes: Array<Omit<NodeOptions, `password`>>

    /**
     * The default array to use for parsing tokens out of strings with the removeToken method in StringUtils.
     */
    defaultTokenArray: Array<{ token: string, replacement: string }>

    /**
     * The maximum number of users to check in a voice channel on voice state updates to see if there are no non-bot users.
     */
    maxUncheckedVoiceStateUsers: number

    /**
     * The total amount of shards to spawn.
     */
    shards: {
        dev: number | `auto`
        prod: number | `auto`
    }
    /**
     * The amount of shards to spawn per cluster.
     */
    shardsPerCluster: {
        dev: number
        prod: number
    }
    /**
      * Intervals to run stats checkups at in milliseconds.
      */
    statsCheckupInterval: {
        dev: number
        prod: number
    }
};

export const Config: BotConfig = {
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

    mongo: {
        url: `mongodb://localhost:27017`,
        dbName: `peter`
    },

    lavalinkNodes: [
        {
            clientName: `peter@${process.env.npm_package_version ?? `0.0.0`}`,
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
    ].concat((JSON.parse(process.env.LAVALINK_PASSWORDS ?? `[]`) as string[]).map((password, i) => ({
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
