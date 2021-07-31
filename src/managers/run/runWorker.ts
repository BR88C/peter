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
    }
}

export class ExtendedPlayer extends BasePlayer {
    /**
     * If the player should stay in the VC after all users leave.
     */
    twentyfourseven: boolean
}

declare module '@discord-rose/lavalink/dist/typings/lib' { // eslint-disable-line quotes
    type player = ExtendedPlayer
}
