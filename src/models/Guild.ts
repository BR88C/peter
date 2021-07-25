import { model, Schema } from 'mongoose';
import { Snowflake } from 'discord-rose';

const GuildSchema: Schema = new Schema({
    /**
     * The Guild's ID.
     */
    id: String,
    /**
     * If the Guild is a premium Guild.
     */
    premium: Boolean,
    /**
     * DJ permissions.
     */
    DJMode: Number
});

export const Guild = model(`Guild`, GuildSchema);
