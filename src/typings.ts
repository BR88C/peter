import { WorkerManager } from './managers/WorkerManager';

// Import modules.
import { CachedVoiceState, Snowflake } from 'discord-rose';
import { Player } from '@discord-rose/lavalink';

declare module 'discord-rose/dist/typings/lib' { // eslint-disable-line quotes
    type worker = WorkerManager
    interface CommandOptions {
        /**
         * The command's category.
         */
        category: string
        /**
         * If the player should specifically be in a PAUSED state.
         */
        mustBePaused: boolean
        /**
         * If the player should specifically be in a PLAYING state.
         */
        mustBePlaying: boolean
        /**
         * If there should be a player for the guild in a CONNECTED, PAUSED, or PLAYING state.
         */
        mustHaveConnectedPlayer: boolean
        /**
         * If there should be a player for the guild.
         */
        mustHavePlayer: boolean
        /**
         * If there should be tracks in the queue.
         */
        mustHaveTracksInQueue: boolean
        /**
         * If the invoking user should be in any VC.
         */
        userMustBeInVC: boolean
        /**
         * If the invoking user should be in the same VC.
         */
        userMustBeInSameVC: boolean
        /**
         * If the command is vote locked.
         */
        voteLocked: boolean
    }
    interface CommandContext {
        player: ExtendedPlayer | undefined
        voiceState: CachedVoiceState | undefined
    }
}

declare module 'discord-rose/dist/clustering/ThreadComms' { // eslint-disable-line quotes
    interface ThreadEvents {
        /**
         * Check if a user has voted.
         */
        CHECK_VOTE: {
            /**
             * The user's ID.
             */
            send: Snowflake
            /**
             * If the user has voted.
             */
            receive: boolean
        }
    }
}

export class ExtendedPlayer extends Player {
    /**
     * If the player should stay in the voice channel after all users leave.
     */
    twentyfourseven: boolean
}

declare module '@discord-rose/lavalink/dist/typings/lib' { // eslint-disable-line quotes
    type player = ExtendedPlayer
}
