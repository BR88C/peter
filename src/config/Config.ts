// Import modules.
import { CacheControlOptions, CacheOptions, Snowflake } from 'discord-rose';

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
     */
    emojiGuildID: Snowflake
    /**
     * IDs of emojis to use.
     */
    emojiIDs: object

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
