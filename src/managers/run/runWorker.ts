import { WorkerManager } from '../WorkerManager';

import { Player as BasePlayer } from '@discord-rose/lavalink';

void new WorkerManager();

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
    }
}

export class ExtendedPlayer extends BasePlayer {
    /**
     * If the player should stay in the voice channel after all users leave.
     */
    twentyfourseven: boolean
}

declare module '@discord-rose/lavalink/dist/typings/lib' { // eslint-disable-line quotes
    type player = ExtendedPlayer
}
