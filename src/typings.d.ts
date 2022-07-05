import { Lavalink } from './structures/Lavalink';

import { Logger } from '@br88c/node-utils';
import { CommandHandler } from '@distype/cmd';
import { Api } from '@top-gg/sdk';
import { Snowflake } from 'distype';

declare module 'distype' { // eslint-disable-line quotes
    // @ts-expect-error 2323
    class Client {
        /**
         * The client's command handler.
         */
        public commandHandler: CommandHandler;
        /**
         * The client's Lavalink manager.
         */
        public lavalink: Lavalink;
        /**
         * The client's logger.
         */
        public logger: Logger;
        /**
         * Initialize the client manager.
         */
        public init (): Promise<void>
        /**
         * The top.gg client.
         */
        public topgg?: Api;
    }
}

declare module '@distype/lavalink' { // eslint-disable-line quotes
    // @ts-expect-error 2323
    class Player {
        /**
         * The player's text channel.
         */
        public textChannel: Snowflake;
        /**
         * If the player has 24/7 enabled.
         */
        public twentyfourseven: boolean;
        /**
         * The active voice timeout.
         */
        public voiceTimeout: NodeJS.Timeout | null;
    }
}
