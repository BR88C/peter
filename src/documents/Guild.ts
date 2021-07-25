import { Document } from 'mongodb';
import { Snowflake } from 'discord-rose';

export interface GuildDocument extends Document {
    /**
     * The Guild's ID.
     */
    id: Snowflake
     /**
      * If the Guild is a premium Guild.
      */
    premium: boolean
     /**
      * DJ only commands.
      */
    DJMode: string[]
}
