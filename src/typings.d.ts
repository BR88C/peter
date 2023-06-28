import { Lavalink } from './structures/Lavalink';

import { Logger } from '@br88c/node-utils';
import { CommandHandler } from '@distype/cmd';
import { APIEmbed } from 'discord-api-types/v10';
import { RestMethod, RestRequestData, RestRoute, Snowflake } from 'distype';

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
        public topggRequest (method: RestMethod, route: RestRoute, options?: RestRequestData): Promise<any>
    }
}

declare module '@distype/lavalink' { // eslint-disable-line quotes
    // @ts-expect-error 2323
    class Player {
        /**
         * The timestamp of the last message sent. -1 if no message has been sent yet.
         */
        public lastMessage: number;
        /**
         * A queue of "now playing" embeds to send.
         */
        public messageQueue: APIEmbed[];
        /**
         * The player's text channel.
         */
        public textChannel: Snowflake | null;
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
