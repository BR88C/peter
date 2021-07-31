import { WorkerManager } from '../WorkerManager';

import { Player as BasePlayer } from '@discord-rose/lavalink';

void new WorkerManager();

declare module 'discord-rose/dist/typings/lib' { // eslint-disable-line quotes
    type worker = WorkerManager
    interface CommandOptions {
        category: string
    }
}

export class ExtendedPlayer extends BasePlayer {
    twentyfourseven: boolean
}

declare module '@discord-rose/lavalink/dist/typings/lib' { // eslint-disable-line quotes
    type player = ExtendedPlayer
}
