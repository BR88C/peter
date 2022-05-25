import { Lavalink } from './structures/Lavalink';

import { Logger } from '@br88c/node-utils';
import { CommandHandler } from '@distype/cmd';

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
    }
}

declare module '@distype/lavalink' { // eslint-disable-line quotes
    // @ts-expect-error 2323
    class Player {
        /**
         * The active voice timeout.
         */
        public voiceTimeout: NodeJS.Timeout | null;
    }
}
